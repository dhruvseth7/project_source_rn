import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, Image } from 'react-native';
import { Chip } from 'react-native-paper';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Slider from '@react-native-community/slider';
import { Button } from 'react-native-paper';
import SelectMultiple from 'react-native-select-multiple'


const FilterRange = ({ state, setState, title, icon, unit, step, min, max, label, maxOrMin }) => {
  const [visible, setVisible] = useState(false);
  let left = 160 / (max - min) * state.displayValue - 20 - 160 * min / (max - min);

  return (
    <Popover
      isVisible={visible}
      onRequestClose={() => {
        setVisible(false);
        setState({...state, displayValue: state.filterValue});
      }}
      placement={PopoverPlacement.BOTTOM}
      arrowStyle={{backgroundColor: 'transparent'}}
      from={(
        <Chip icon={icon} compact={true} selectedColor={state.active ? 'white' : 'black'}
          textStyle={{fontFamily: 'Avenir', fontSize: 13}}
          style={[styles.filterBtn, {backgroundColor: state.active ? '#19D2CC' : '#EFEFEF'}]}
          onPress={() => setVisible(true)}
        >
          {title}
        </Chip>
      )}>
      <View style={styles.filterCard}>
        <Text style={styles.label}>{label}</Text>
        <Text style={{top: 7, left: left, width: 80, marginBottom: 6, textAlign: 'center', fontFamily: 'Avenir', fontWeight: '300', fontSize: 12 } }>
            {Math.floor(state.displayValue) + " " + unit}
        </Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={min}
          maximumValue={max}
          step={step}
          minimumTrackTintColor="#2CCADA"
          maximumTrackTintColor="#26A5B2"
          value={state.displayValue}
          onSlidingComplete={val => setState({...state, displayValue: val})}
        />
        <View style={{flexDirection: 'row', marginLeft: 20}}>
          <Button icon="close" compact={true} onPress={() => {
              setState({active: false, filterValue: (maxOrMin === "max" ? max : min), displayValue: (maxOrMin === "max" ? max : min)});
              setVisible(false);
            }}
            color="#515151"
            style={{alignSelf: 'center', top: 5, left: -5}}
            labelStyle={{fontFamily: 'Futura', fontSize: 12}}>Remove
          </Button>
          <Button icon="check" compact={true} onPress={() => {
            setState({...state, active: true, filterValue: state.displayValue});
            setVisible(false);
          }}
            color="#515151"
            style={{alignSelf: 'center', top: 5, left: -12}}
            labelStyle={{fontFamily: 'Futura', fontSize: 12}}>
              Apply
          </Button>
        </View>
      </View>
    </Popover>
  )

}

const FilterSelect = ({ state, setState, icon, title, label }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      isVisible={visible}
      onRequestClose={() => {
        setVisible(false);
        setState({...state, displayValue: state.filterValue});
      }}
      placement={PopoverPlacement.BOTTOM}
      arrowStyle={{backgroundColor: 'transparent'}}
      from={(
        <Chip icon={icon} compact={true} selectedColor={state.active ? 'white' : 'black'}
          textStyle={{fontFamily: 'Avenir', fontSize: 13}}
          style={[styles.filterBtn, {backgroundColor: state.active ? '#19D2CC' : '#EAEAEA'}]}
          onPress={() => setVisible(true)}
        >
          {title}
        </Chip>
      )}>
      <View style={[styles.filterCard, {height: 177}]}>
        <Text style={styles.label}>{label}</Text>

        <SelectMultiple
          items={["English", "Burmese"]}
          selectedItems={state.displayValue}
          onSelectionsChange={(val) => setState({...state, displayValue: val})}
          rowStyle={{borderBottomWidth: 0, marginBottom: -15}}
          labelStyle={{fontFamily: 'Avenir', fontWeight: '300', top: 1, left: 3}}
          style={{top: -5}}
         />


        <View style={{flexDirection: 'row', marginLeft: 20, top: 5}}>
          <Button icon="close" compact={true} onPress={() => {
              setState({active: false, displayValue: [], filterValue: []});
              setVisible(false);
            }}
            color="#515151"
            style={{alignSelf: 'center', top: 5, left: -5}}
            labelStyle={{fontFamily: 'Futura', fontSize: 12}}>Remove
          </Button>
          <Button icon="check" compact={true} onPress={() => {
            setState({...state, active: true, filterValue: state.displayValue});
            setVisible(false);
          }}
            color="#515151"
            style={{alignSelf: 'center', top: 5, left: -12}}
            labelStyle={{fontFamily: 'Futura', fontSize: 12}}>
              Apply
          </Button>
        </View>
      </View>
    </Popover>
  )
}


const FilterGrid = ({ price, setPrice, clients, setClients, availability, setAvailability, connections, setConnections, languages, setLanguages }) => {

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterGrid}>
      <FilterRange setState={setPrice} state={price} maxOrMin="max"
              icon="currency-usd" title="Promoter Fees"
              label="Maximum Promoter Fees"
              unit="MMK"
              min={500} max={5000} step={100}
       />

       <FilterRange setState={setClients} state={clients} maxOrMin="min"
               icon="account-key" title="Clients Sourced"
               label="Minimum # of Clients Sourced"
               unit=""
               min={0} max={100} step={1}
        />


       <FilterRange setState={setAvailability} state={availability} maxOrMin="min"
               icon="clock" title="Availability"
               label="Minimum Weekly Availability"
               unit="hrs"
               min={3} max={15} step={1}
        />

        <FilterRange setState={setConnections} state={connections} maxOrMin="min"
                icon="instagram" title="Social Connections"
                label="Minimum Social Connections"
                unit=""
                min={500} max={3000} step={100}
         />

         <FilterSelect state={languages} setState={setLanguages}
           icon="alphabetical" title="Languages" label="Preferred Languages" />



    </ScrollView>
  )

}

const styles = StyleSheet.create({
  filterGrid: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 32,
    marginBottom: 5
  },
  filterBtn: {
    marginRight: 10
  },
  filterCard: {
    padding: 25,
    width: 255,
    height: 150
  },
  label: {
    fontFamily: 'Avenir',
    top: -5
  }
})

export default FilterGrid;
