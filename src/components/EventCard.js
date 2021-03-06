import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { FAB } from 'react-native-paper';
import QuickCreateEventModal from "./QuickCreateEventModal";
import { getData } from '../utils/localStorage';
import env from "../utils/environment";
import { saveUnsaveEvent } from "../serverSDK/api";
import { deleteEventWithId } from "../serverSDK/api/event";
import { getAttendanceFromEventId } from "../serverSDK/api/event";

const EventCard = ({ event, refreshEvents, view, isSaved, promoters }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [quickCreateVisible, setQuickCreateVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isCurrentEvent, setIsCurrentEvent] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const [guestListVisible, setGuestListVisible] = useState(false);

  // NOTE: JWTd (done)
  const saveEvent = async () => {
    const accessToken = await getData('@accessToken')
    const response = await saveUnsaveEvent(accessToken, event._id)

    if (response.status === "Success") {
      setSaved(!saved);
      refreshEvents();
    }
  }

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved])


  useEffect(() => {
    const difference = (new Date(event.date) - new Date()) / 86400000;
    if (difference <= 0.5 && difference >= -0.5) {
      setIsCurrentEvent(true);
    } else if (difference < -0.5) {
      setIsPastEvent(true);
    } else if (difference > 0.5) {
      setIsCurrentEvent(false);
    }
  }, [event, navigation])



  const editEvent = () => {
    const currentDate = new Date();
    const difference = (new Date(event.date) - currentDate) / (1000 * 3600 * 24);

    if (difference >= -0.5 && difference <= 2) {
      Alert.alert("We're Sorry", "Events can't be edited less than 2 days before they occur");
    } else {
      navigation.navigate('VenueEventForm', {
        action: 'Update Event',
        event
      })
    }
  }

  // NOTE: JWTd (done)
  const deleteEvent = () => {
    const currentDate = new Date();
    const difference = (new Date(event.date) - currentDate) / (1000 * 3600 * 24);

    if (difference >= -0.5 && difference <= 2) {
      Alert.alert("We're Sorry", "Events can't be deleted less than 2 days before they occur");
    } else {
      Alert.alert(
        "Are you sure you want to delete this event?",
        "This cannot be undone",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              getData('@accessToken').then(response => {
                deleteEventWithId(response, event._id).then(data => {
                  if (data.status === "Success") {
                    refreshEvents();
                  }
                })
              })
            }
          }
        ],
        { cancelable: false }
      );

    }
  }

  const viewEvent = () => {
    if (view === "Venue") {
      navigation.navigate('VenueEventPage', {
        event,
        view
      })
    } else {
      navigation.navigate('PromoterEventDetail', {
        event,
        isSaved: saved,
        view
      })
    }
  }

  if (view === "Venue") {
    return (
      <>
        <TouchableOpacity onPress={viewEvent} activeOpacity={0.7}>
          <View style={[styles.card, {marginBottom: 0}]}>
            <Image style={styles.eventImage} source={{ uri: event.imageURL }}></Image>

            <View style={styles.cardContent}>
              <View style={styles.leftCol}>
                <Text style={styles.eventName}>{event.eventName}</Text>
                <Text style={styles.eventDate}>{new Date(event.date).toDateString() + " " + new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>

              <View style={styles.rightCol}>
                <View style={styles.btnContainer}>
                  {isPastEvent ? (
                    <TouchableOpacity onPress={() => setQuickCreateVisible(true)}>
                      <View style={styles.circularBtn}>
                        <FontAwesome5 name="clone" style={styles.cardIcon} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                      <TouchableOpacity onPress={editEvent}>
                        <View style={styles.circularBtn}>
                          <FontAwesome5 name="pen-alt" style={styles.cardIcon} />
                        </View>
                      </TouchableOpacity>
                    )}

                  <TouchableOpacity onPress={deleteEvent}>
                    <View style={styles.circularBtn}>
                      <FontAwesome5 name="trash" style={styles.cardIcon} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {isCurrentEvent ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('RegisterGuestsScreen', {
                    event: event,
                    promoters: promoters
                  })} style={[styles.eventButton, { paddingHorizontal: Dimensions.get('window').width > 400 ? 39 : 16 }]}>
                    <FontAwesome5 style={styles.btnIcon} name="user-plus" />
                    <Text style={styles.btnText}>Register Guests</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('GuestListScreen', {
                    event: event
                  })} style={styles.eventButton}>
                    <FontAwesome5 style={styles.btnIcon} name="clipboard-list" />
                    <Text style={styles.btnText}>Guest List</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                  <></>
                )}
              {isPastEvent ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('GuestListScreen', {
                    event: event
                  })} style={styles.eventButton}>
                    <FontAwesome5 style={styles.btnIcon} name="clipboard-list" />
                    <Text style={styles.btnText}>Guest List</Text>
                  </TouchableOpacity>
                </View>
              ) : <></>}
            </View>
          </View>
        </TouchableOpacity>



        <QuickCreateEventModal
          modalVisible={quickCreateVisible} setModalVisible={setQuickCreateVisible}
          event={event} refreshEvents={refreshEvents}
        />
      </>
    )
  } else if (view === "Promoter") {
    return (
      <TouchableOpacity onPress={viewEvent} activeOpacity={0.8}>
        <View style={[styles.card, {marginBottom: 15}]}>
          <Image style={styles.eventImage} source={{ uri: event.imageURL }}></Image>
          <View style={[styles.cardContent, { marginBottom: 0 }]}>
            <View style={styles.leftCol}>
              <Text style={[styles.eventName, { fontSize: 20 }]}>{event.eventName}</Text>
              <Text style={[styles.eventName, { fontSize: 15, marginTop: 0 }]}>{event.venueName}</Text>
              <Text style={[styles.eventDate, { marginBottom: 18, marginTop: 3 }]}>{new Date(event.date).toDateString() + " " + new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>

            <View style={styles.rightCol}>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={saveEvent}>
                  <View style={styles.circularBtn}>
                    {saved ? (<FontAwesome name="bookmark" style={styles.cardIcon} />) : (
                      <FontAwesome name="bookmark-o" style={styles.cardIcon} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.promoterFeesContainer}>
                <Text style={styles.promoterFees}>{event.promoterFees} MMK / head</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}




const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.20,
    elevation: 8,
    backgroundColor: 'white',
    left: 1,
    borderRadius: 28
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  leftCol: {
    marginTop: 12,
    width: '60%',
    left: 15
  },
  rightCol: {
    marginTop: 10,
    right: 5
  },
  eventImage: {
    width: '100%',
    height: 190,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  eventName: {
    fontFamily: 'Avenir',
    fontSize: 19,
    fontWeight: '300',
    alignSelf: 'flex-start'
  },
  eventDate: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: '300',
    alignSelf: 'flex-start',
    marginBottom: 8
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    top: -4
  },
  circularBtn: {
    width: 30,
    height: 30,
    borderRadius: 24,
    marginRight: 10,
  },
  saveButton: {
    marginRight: 15,
    marginLeft: 5,
    top: 10
  },
  cardIcon: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 10,
    color: '#1AB0A8'
  },
  promoterFeesContainer: {
    marginTop: 19,
    marginRight: 16
  },
  promoterFees: {
    fontFamily: 'Avenir',
    fontWeight: '400',
    fontSize: 13,
    color: '#535353'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 15,
    left: 15
  },
  eventButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#1AB0A8',
    borderWidth: 1.5,
    borderRadius: 25,
    padding: 12,
    marginRight: 10,
  },
  btnIcon: {
    marginLeft: 3,
    fontSize: 14,
    top: 1,
    color: '#1AB0A8',
  },
  btnText: {
    fontSize: 13,
    color: '#1AB0A8',
    marginLeft: 8,
    fontWeight: '400',
    fontFamily: 'Avenir',
    marginRight: 2
  },

})

export default EventCard;
