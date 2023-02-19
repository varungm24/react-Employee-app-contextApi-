import React, { useState } from 'react'
import { StyleSheet, View, Modal, Alert, KeyboardAvoidingView, ScrollView } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

const CreateEmployee = ({ navigation, route }) => {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case 'name':
          return route.params.name
        case 'phone':
          return route.params.phone
        case 'email':
          return route.params.email
        case 'salary':
          return route.params.salary
        case 'picture':
          return route.params.picture
        case 'position':
          return route.params.position
      }
    }
    return ''
  }
  const [name, setName] = useState(getDetails('name'))
  const [phone, setPhone] = useState(getDetails('phone'))
  const [email, setEmail] = useState(getDetails('email'))
  const [position, setPosition] = useState(getDetails('position'))
  const [salary, setSalary] = useState(getDetails('salary'))
  const [picture, setPicture] = useState(getDetails('picture'))
  const [modal, setModal] = useState(false)
  const [enableShift, setEnableShift] = useState(false)
  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (granted) {
      const data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })
      if (!data.cancelled) {
        let file = {
          uri: data.uri,
          type: `test/${data.uri.split('.')[1]}`,
          name: `test.${data.uri.split('.')[1]}`,
        }
        handleUpload(file)
      }
    } else {
      Alert.alert('you need to give us the permission to work')
    }
  }
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (granted) {
      const data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })
    } else {
      Alert.alert('you need to give us the permission to work')
    }
  }
  const handleUpload = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'narutoApp')
    data.append('cloud_name', 'varungm')

    fetch('https://api.cloudinary.com/v1_1/varungm/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPicture(data?.url)
        setModal(false)
      })
  }

  const submitData = () => {
    fetch('https://empoyee-fw02yz4ik-varungm24.vercel.app/send-data', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        salary,
        picture,
        position,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} is saved successfully`)
        navigation.navigate('Home')
      })
      .catch((err) => {
        Alert.alert('something went wrong')
      })
  }

  const updateDetails = () => {
    fetch('https://empoyee-fw02yz4ik-varungm24.vercel.app/update', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: route.params._id,
        name,
        email,
        salary,
        picture,
        position,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} is updated successfuly`)
        navigation.navigate('Home')
      })
      .catch((err) => {
        Alert.alert('someting went wrong')
      })
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior="position" enabled={enableShift}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode='on-drag'>
        <TextInput
          label="Name"
          value={name}
          mode="outlined"
          theme={theme}
          onFocus={() => {
            setEnableShift(false)
          }}
          onChangeText={(text) => setName(text)}
          style={styles.inputStyle}
        />
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          theme={theme}
          onFocus={() => {
            setEnableShift(false)
          }}
          onChangeText={(text) => setEmail(text)}
          style={styles.inputStyle}
        />
        <TextInput
          label="Phone Number"
          value={phone}
          mode="outlined"
          theme={theme}
          onFocus={() => {
            setEnableShift(false)
          }}
          keyboardType="number-pad"
          onChangeText={(text) => setPhone(text)}
          style={styles.inputStyle}
        />
        <TextInput
          label="Salary"
          value={salary}
          mode="outlined"
          theme={theme}
          onFocus={() => {
            setEnableShift(true)
          }}
          onChangeText={(text) => setSalary(text)}
          style={styles.inputStyle}
        />
        <TextInput
          label="Position"
          value={position}
          mode="outlined"
          theme={theme}
          onFocus={() => {
            setEnableShift(true)
          }}
          onChangeText={(text) => setPosition(text)}
          style={styles.inputStyle}
        />
        <Button
          icon={picture === '' ? 'upload' : 'check'}
          mode="contained"
          theme={theme}
          style={styles.inputStyle}
          onPress={() => setModal(true)}
        >
          Upload Image
        </Button>
        {route?.params ? (
          <Button
            icon="content-save"
            mode="contained"
            theme={theme}
            style={styles.inputStyle}
            onPress={() => {
              updateDetails()
            }}
          >
            Update
          </Button>
        ) : (
          <Button
            icon="content-save"
            mode="contained"
            theme={theme}
            style={styles.inputStyle}
            onPress={() => {
              submitData()
            }}
          >
            Save
          </Button>
        )}

        {modal && (
          <Modal
            animationType="slide"
            transparent
            visible={modal}
            onRequestClose={() => setModal(false)}
          >
            <View style={styles.modalView}>
              <View style={styles.modalButtonView}>
                <Button
                  mode="contained"
                  icon="camera"
                  theme={theme}
                  onPress={() => pickFromCamera()}
                >
                  camera
                </Button>
                <Button
                  icon="image-area"
                  mode="contained"
                  theme={theme}
                  onPress={() => pickFromGallery()}
                >
                  gallery
                </Button>
              </View>
              <Button theme={theme} onPress={() => setModal(false)}>
                Cancel
              </Button>
            </View>
          </Modal>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const theme = {
  colors: {
    primary: '#006aff',
  },
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputStyle: {
    margin: 10,
  },
  modalView: {
    position: 'absolute',
    bottom: 2,
    width: '100%',
    paddingVertical: 40,
    backgroundColor: 'white',
  },
  modalButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
})

export default CreateEmployee
