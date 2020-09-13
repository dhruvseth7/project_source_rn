import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { getData } from "../../utils/localStorage";
import { useNavigation } from "@react-navigation/native";

const EventDetails = ({ route }) => {
  const [venue, setVenue] = useState({});
  const [eventType, setEventType] = useState({});
  const event = route.params.event;
  const navigation = useNavigation();

  useEffect(() => {
    switch (event.category) {
      case "Night Out":
        setEventType({name: "Night Out", icon: "moon"})
        break;
      case "Show":
        setEventType({name: "Show", icon: "microphone-alt"})
        break;
      case "Themed Event":
        setEventType({name: "Themed Event", icon: "hat-wizard"})
        break;
      case "Couples Event":
        setEventType({name: "Couples Event", icon: "restroom"})
        break;
      case "Activity":
          setEventType({name: "Activity", icon: "dice"})
          break;
      default:
          break;
    }

  }, [])

  useEffect(() => {
    getData('@venueFormData').then(data => setVenue(data));
  }, [])

  return (
    <ScrollView style={styles.background}>

      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('VenueEventsHome')}>
        <Entypo name="chevron-small-left" size={34} color="black" />
      </TouchableOpacity>
      <Image source={{uri: event.imageURL}} style={styles.eventImage}></Image>

      <View style={styles.eventComponent}>
        <Text style={styles.title}>{event.eventName}</Text>
        <View style={{flexDirection: "row"}}>
          <Text style={styles.eventCategory}>{eventType.name}</Text>
          <FontAwesome5 name={eventType.icon} style={{marginTop: 7, marginLeft: 4}}/>
        </View>
      </View>


      <View style={styles.eventComponent}>
        <View style={{flexDirection: "row"}}>
          <View style={{width: "60%"}}>
            <Text style={styles.venueName}>{venue.venueName}</Text>
            <Text style={styles.address}>{venue.venueAddress}</Text>
          </View>
          <View style={{width: "40%", marginTop: 1}}>
            <Text style={[styles.contact, {fontWeight: '400', marginBottom: 5, fontSize: 15}]}>Contact Details</Text>
            <Text style={styles.contact}>{venue.venueContactEmail}</Text>
            <Text style={styles.contact}>{venue.venueContactPhone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventComponent}>
        <View style={styles.eventDetail}>
          <FontAwesome5 style={styles.detailIcon} name="calendar-alt" />
          <Text style={[styles.detailText, {marginLeft: 21}]}>Occurs next on {event.date.toDateString()}</Text>
        </View>
        <View style={styles.eventDetail}>
          <FontAwesome5 style={styles.detailIcon} name="clock" />
          <Text style={[styles.detailText, {marginLeft: 18}]}>Starts at {event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
        </View>
        <View style={styles.eventDetail}>
          <FontAwesome5 style={styles.detailIcon} name="glass-cheers" />
          <Text style={[styles.detailText, {marginLeft: 12}]}>{event.promotion}</Text>
        </View>
        <View style={[styles.eventDetail, {marginBottom: 10}]}>
          <FontAwesome5 style={styles.detailIcon} name="money-bill-wave" />
          <Text style={styles.detailText}>{event.fees} MMK per head promoter fees</Text>
        </View>
      </View>

      <View style={{marginLeft: 20, paddingHorizontal: 5, paddingVertical: 20, width: '88%', marginBottom: 20}}>
        <Text style={styles.description}>{event.description}</Text>

      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flex: 1
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 35,
    fontWeight: '300'
  },
  eventCategory: {
    marginTop: 5,
    fontFamily: 'Avenir',
    fontWeight: '300',
    marginLeft: 4
  },
  eventImage: {
    width: '100%',
    height: 350,
    alignSelf: 'center'
  },
  eventComponent: {
    marginLeft: 20,
    paddingHorizontal: 5,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    width: '88%'
  },
  venueName: {
    fontFamily: 'Avenir',
    fontSize: 27,
    fontWeight: '300'
  },
  address: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 5,
    width: '80%'
  },
  contact: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 5
  },
  eventDetail: {
    flexDirection: 'row',
    marginLeft: 3,
    marginBottom: 20
  },
  detailIcon: {
    fontSize: 26
  },
  detailText: {
    marginLeft: 10,
    marginTop: 6,
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'Gill Sans'
  },
  description: {
    fontFamily: 'Avenir',
    fontWeight: '300'
  },
  backArrow: {
    position: 'absolute',
    top: 45,
    left: 10,
    zIndex: 1
  }

})

export default EventDetails;