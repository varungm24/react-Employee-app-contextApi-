import React, { useEffect, useContext } from 'react'
import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native'
import { Card, FAB } from 'react-native-paper'
import { MyContext } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
const Home = ({ navigation }) => {
  // const [data, setData] = useState([])
  // const [loading, setLoading] = useState(true)
  // const { data, loading } = useSelector((state) => {
  //   return state
  // })
  // const dispatch = useDispatch()

  const { state, dispatch } = useContext(MyContext)
  const { data, loading } = state

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () =>
    fetch('https://empoyee-fw02yz4ik-varungm24.vercel.app')
      .then((res) => res.json())
      .then((result) => {
        // setData(result)
        // setLoading(false)
        dispatch({ type: 'ADD_DATA', payload: result })
        dispatch({ type: 'SET_LOADING', payload: false })
      })
      .catch((err) => {
        Alert.alert('something went wrong, try again later!!')
      })

  const renderList = (item) => {
    return (
      <Card style={styles.myCard} onPress={() => navigation.navigate('Profile', { item })}>
        <View style={styles.cardView}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
            source={{
              uri: item?.picture,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.text}>{item?.name}</Text>
            <Text>{item?.position}</Text>
          </View>
        </View>
      </Card>
    )
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return renderList(item)
          }}
          keyExtractor={(item) => `${item?._id}`}
          refreshing={loading}
          onRefresh={() => fetchData()}
        />
      </View>
      <FAB
        icon="plus"
        color="white"
        style={[styles.fab, { backgroundColor: '#006aff' }]}
        onPress={() => {
          navigation.navigate('Create')
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  myCard: {
    margin: 10,
  },
  cardView: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
})

export default Home
