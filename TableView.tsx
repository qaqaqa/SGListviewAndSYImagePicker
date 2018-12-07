import * as React from 'react';
import { FlatList, StyleSheet, Image, Text, View, ListView } from 'react-native';
var Dimensions = require('Dimensions');
const window = Dimensions.get("window");
const cheerio = require('cheerio-without-node-native');
import FastImage from 'react-native-fast-image'
import SGListView from 'react-native-sglistview';

class TableView extends React.Component<any, any> {
    _flatList;
    urls = [];
    imageUrls = [];
    pageArr = [1];
    state = {
        videoArr: [],
        imageArr: [],
        currentPage: 0
    }

    videoDatas = [];
    imageDatas = [];

    async getVideoData(pageIndex) {
        const response = await fetch('http://www.aipai.com/ext/syPcZone_action-card_appid-11616_id-301740_total-472_page-' + pageIndex + '.html')
        console.log('http 请求：', 'http://www.aipai.com/ext/syPcZone_action-card_appid-11616_id-301740_total-472_page-' + pageIndex + '.html');
        var res = await response.text();
        const $ = cheerio.load(res);

        let video_list = $(".video_list h5 a")
        let image_list = $(".video_list img")

        for (let index = 0; index < image_list.length; index++) {
            const element = image_list[index];
            this.imageUrls.push($(element).attr('src'))
        }

        this.setState({
            videoArr: this.urls,
            imageArr: this.imageUrls
        });
    }

    componentWillMount() {
        this.getVideoData(1);
    }

    _renderItem = (entry, key) => {
        console.log('当前cell tag:',entry.index);
        var imageView = null;
        imageView = <FastImage
            style={{
                width: 200,
                height: 200,
                backgroundColor: 'yellow',
            }}
            source={{
                uri: entry.item,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
        return <View style={{ marginTop: 20 }}>
            {imageView}
        </View>
    }

    renderRow(rowData, sectionID, rowID) {
        console.log('当前cell tag:',rowData,sectionID,rowID);
        var imageView = null;
        imageView = <FastImage
            style={{
                width: 200,
                height: 200,
                backgroundColor: 'yellow',
            }}
            source={{
                uri: rowData,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
        // imageView = <Image 
        // style={{
        //     width: 200,
        //     height: 200,
        //     backgroundColor: 'yellow',
        // }}
        // source={{
        //     uri: rowData,
        // }}
        // />
        return <View style={{ marginTop: 20 }}>
            {imageView}
        </View>
      }

    render() {

        let currentPage = this.state.currentPage;
        console.log('render......', this.state.imageArr, this.state.imageArr.length)
        if (this.state.imageArr.length >= 3) {
            return (
                <View>
                    <SGListView
                        ref={(flatList) => this._flatList = flatList}
                        dataSource={this.getDataSource()}
                        renderRow={this.renderRow}
                    />
                    {/* <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        style={{ width: window.width, height: window.height }}
                        renderItem={this._renderItem}
                        data={[...this.state.imageArr]}>
                    </FlatList> */}
                </View>

            )
        } else {
            return <Text style={{ alignSelf: 'center', margin: 200, width: window.width, textAlign: 'center' }}>没得数据！！！</Text>;
        }

    }

    getDataSource() {
        const dataSource = new ListView.DataSource(
          { rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid });
    
        const deals = this.state.imageArr.length > 0;
        return deals ? dataSource.cloneWithRows(this.state.imageArr) : dataSource;
      }

}

export default TableView;

const styles = StyleSheet.create({

})