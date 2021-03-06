import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, Image, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  PulseIndicator,
  DotIndicator,
  MaterialIndicator,
} from 'react-native-indicators';
import EventCard from "../../../components/EventCard";
import Header from "../../../components/Header";
import { getEventfromVenueId } from "../../../serverSDK/api/event";
import { getVenueDetails } from "../../../serverSDK/api/index";
import env from "../../../utils/environment";
import { getData } from "../../../utils/localStorage";
import Jumbotron from "../../../components/Jumbotron";
import { FAB } from 'react-native-paper';
import { getEventfromAccessToken } from '../../../serverSDK/api/event';
import { getPromoters } from '../../../serverSDK/api/index';

const VenueEventsScreen = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isUpcoming, setUpcoming] = useState(true);
  const [isPast, setPast] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [])

  const sortByDate = (arr) => {
    return arr.sort(function (a, b) {
      var keyA = new Date(a.date);
      var keyB = new Date(b.date);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }

  // NOTE: JWTd (done)
  const fetchData = async () => {
    const accessToken = await getData('@accessToken');

    getPromoters(accessToken).then(data => setPromoters(data));

    const response = await getEventfromAccessToken(accessToken);

    const currentDate = new Date();
    let upcomingArr = [];
    let pastArr = [];
    response.forEach(event => {
      const difference = (new Date(event.date) - currentDate) / 86400000;
      if (difference >= -0.5) {
        upcomingArr.push(event);
      } else {
        pastArr.push(event);
      }
    })
    setUpcomingEvents(sortByDate(upcomingArr));
    setPastEvents(sortByDate(pastArr));
    setLoading(false);
  }

  const handlePress = (btn) => {
    if (btn === 'Upcoming') {
      if (!isUpcoming) {
        setUpcoming(true);
        setPast(false);
      }
    } else if (btn === 'Past') {
      if (!isPast) {
        setUpcoming(false);
        setPast(true);
      }
    }
  }

  return (
    <ScrollView style={styles.background} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <Text style={styles.title}>Events</Text>
      <Jumbotron
        title="Get Started"
        caption="Create custom events for your target market and share them with our network of promoters"
        image="https://lasvegasnightclubs.com/wp-content/uploads/2018/06/27067569_10155555444533043_9174124228487188550_n-min-2.jpg"
      />

      <Text style={styles.subTitle}>Your Events</Text>
      <ScrollView style={styles.eventContainer}>
        {isLoading ? (<MaterialIndicator size={28} color="#22D2C9" style={{ alignSelf: 'center', left: -11, marginTop: 25, marginBottom: 20 }}></MaterialIndicator>) : (<>
          {upcomingEvents.length === 0 && pastEvents.length === 0
            ? <>
                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.tabButton} onPress={() => handlePress('Upcoming')}>
                    <Text style={isUpcoming ? styles.active : styles.btnText}>Upcoming</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tabButton} onPress={() => handlePress('Past')}>
                    <Text style={isPast ? styles.active : styles.btnText}>Past</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: "Avenir", fontWeight: '400', fontSize: 14, marginTop: 5, marginLeft: 3, color: '#5A5A5A' }}>You have no events to show yet. Add your first now!</Text>
              </>
            :
            <>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.tabButton} onPress={() => handlePress('Upcoming')}>
                  <Text style={isUpcoming ? styles.active : styles.btnText}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => handlePress('Past')}>
                  <Text style={isPast ? styles.active : styles.btnText}>Past</Text>
                </TouchableOpacity>
              </View>

              {isUpcoming && upcomingEvents.length === 0 ? (
                <Text style={{ fontFamily: "Avenir", fontWeight: '300', marginTop: 5, marginLeft: 2, color: '#5A5A5A' }}>You have no upcoming events. Add one now!</Text>
              ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={isUpcoming ? upcomingEvents : pastEvents}
                    keyExtractor={event => event.eventName}
                    renderItem={({ item }) => {
                      return <EventCard event={item} refreshEvents={fetchData} promoters={promoters} view="Venue" />
                    }}
                  ></FlatList>
                )}
            </>}
        </>)}

      </ScrollView>
      {isUpcoming ? (
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => navigation.navigate('VenueEventForm')}
        />
      ) : <></>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1
  },
  title: {
    marginTop: 100,
    marginLeft: 33,
    fontFamily: 'Futura',
    fontSize: 35,
    fontWeight: '400',
    marginBottom: 20,
    color: '#343434',
  },
  subTitle: {
    fontSize: 27,
    fontFamily: 'Gill Sans',
    fontWeight: '400',
    color: '#2A2A2A',
    marginLeft: 33,
    marginTop: 30
  },
  eventContainer: {
    marginTop: 7,
    marginLeft: 35,
    marginBottom: 25
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  btnText: {
    fontFamily: 'Avenir',
    fontWeight: '400',
    fontSize: 15
  },
  tabButton: {
    marginRight: 10
  },
  active: {
    color: '#1AB0A8',
    fontFamily: 'Avenir',
    fontWeight: '300',
    fontSize: 15
  },
  fab: {
    backgroundColor: '#1AB0A8',
    width: 56,
    shadowOpacity: 0.12,
    height: 56,
    marginBottom: 60,
    elevation: 5,
    left: 5,
    right: 5,
    alignSelf: 'center'
  }
})

export default VenueEventsScreen;
