/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, Image, View, StyleSheet, Text, Dimensions } from 'react-native';
import SYImagePicker from 'react-native-syan-image-picker';
import TableView from './TableView'

const { width } = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      photos: []
    }
  }

  componentWillUnmount() {
    SYImagePicker.removeAllPhoto()
    SYImagePicker.deleteCache();
  }

  render() {
    var { photos } = this.state
    if (photos.length > 9) {
      photos = photos.slice(0, 9)
    }
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ backgroundColor: 'red', marginLeft: 20, marginTop: 50 }} onPress={() => this.openCarmera()}>
              <Text style={{ padding: 20 }}>拍照</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'red', marginLeft: 20, marginTop: 50 }} onPress={() => this.openAlbum()}>
              <Text style={{ padding: 20 }}>相册</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'red', marginLeft: 20, marginTop: 50 }} onPress={() => this.submit()}>
              <Text style={{ padding: 20 }}>上传</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
            {photos.map((photo, index) => {
              let source = { uri: photo.uri };
              if (photo.enableBase64) {
                source = { uri: photo.base64 };
              }
              return (
                <View
                  key={`image-${index}`}
                  style={styles.image}>

                  <Image
                    key={`image-${index}`}
                    style={styles.image}
                    source={source}
                    resizeMode={"cover"}
                  />

                  <TouchableOpacity
                    style={{ position: 'absolute', marginLeft: (width - 40) / 3 - 10, marginTop: 0 }} onPress={() => this.deleteImage(index)}>
                    <Image style={{ width: 20, height: 20 }} source={require('./delete.jpeg')}></Image>
                  </TouchableOpacity>
                </View>

              )
            })}
            
          </ScrollView>
          <TableView />
        </View>

      </View>
    );
  }

  openCarmera = () => {
    SYImagePicker.openCamera({ showCropFrame: false }, (err, photos) => {
      if (!err) {
        this.setState({
          photos: [...this.state.photos, ...photos]
        })
      }
    })
  }

  openAlbum = () => {
    SYImagePicker.showImagePicker({ imageCount: 9 - this.state.photos.length }, (err, photos) => {
      if (!err) {
        this.setState({
          photos: [...this.state.photos, ...photos]
        })
      }
    })
  }

  deleteImage = (index) => {
    var { photos } = this.state;
    var newPhotos = photos.filter((photo, photoIndex) => photoIndex !== index);
    SYImagePicker.removePhotoAtIndex(index);
    this.setState({
      photos: newPhotos
    });
  }

  submit = () => {
    console.log('选择上传的图片:', this.state.photos);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 5,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  image: {
    margin: 5,
    width: (width - 40) / 3,
    height: (width - 40) / 3,
  },
});
