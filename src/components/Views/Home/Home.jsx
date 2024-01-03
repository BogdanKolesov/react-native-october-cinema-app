import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, View, Text, Image, TextInput, FlatList, Dimensions} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { APP_BASE_URL, APP_API_KEY, APP_POSTER_URL} from '@env';

export default function Home() {
  const [moviesData, setMoviesData] = useState([]);
  const WIDTH = Dimensions.get('screen').width
  const ITEM_WIDTH = (WIDTH * 0.72)
  const MOVIE_SPACE_WIDTH = (WIDTH - ITEM_WIDTH)
  useEffect(() => {
    getMoviesDataFromDB();
  }, []);

  const getMoviesDataFromDB = async () => {
    try {
      const response = await axios.get(`${APP_BASE_URL}/movie/popular?language=ru_RU&page=1`, {
        headers: {
          Authorization: `Bearer ${APP_API_KEY}`
        }
      });

      setMoviesData(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: '#1A1A23', padding: 0, position: 'relative'}}>
      <StatusBar barStyle='light-content' backgroundColor='#1A1A23'/>
      <View style={{
        width: '100%',
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}> 
        <View>
          <Text style={{color: '#ffffff', fontSize: 30, fontWeight: '300'}}> 
              Кинотеатр "Октябрь"
          </Text>
          <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginRight: 10}}>
                Привет, 
              </Text>
              <Text style={{color: '#ffffff', fontSize: 24, fontWeight: '300'}}> 
                bkjs.ru
              </Text>
          </View>
                 </View>
        <View style={{width: 40, height: 40, borderRadius: 100, backgroundColor: '#ffffff30', overflow: 'hidden'}}>  
            <Image source={require('../../../assets/image/avatar.jpg')} 
            style={{width: '100%', height: '100%', borderRadius: 100}}
            />
        </View>
      </View>
     <View>
     <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}> 
        <View style={{width: '90%', paddingHorizontal:  20, flexDirection:'row', height: 50, alignItems:'center', justifyContent:'space-between', backgroundColor:'#262532', borderRadius: 10}}>
        
          <Ionic name='mic-outline' style={{fontSize:18, color:'#ffffff', opacity: 0.4}}/>
          <TextInput placeholder='Поиск' placeholderTextColor="#70717A" style={{color: '#fff'}} />
          <Ionic name='search' style={{fontSize:18, color:'#ffffff', opacity: 0.4}}/>

      </View>        
      </View>
      </View>
      <View 
      style={{
        flexDirection:'row',
        padding: 20,
        marginBottom: 20,
        marginTop: 10
      }}> 
        <Text style={{
          color: '#ffffff',
          fontSize: 16,
          marginRight: 8,
          fontWeight:'bold'
        }}>
          Фильмы
        </Text>
        <Text style={{
          color: '#ffffff',
          fontSize: 16,
          marginRight: 8
        }}>
        в прокате
        </Text>
      </View>
      <FlatList
        data={moviesData}
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'center',
          position: 'relative',
          paddingBottom: 70,
          zIndex: 1
        }}
        ListHeaderComponent={() =>{
          return(
            <View style={{width:MOVIE_SPACE_WIDTH, height: 300}}>

            </View>
          )
        }}
        ListFooterComponent={() =>{
          return(
            <View style={{width:MOVIE_SPACE_WIDTH, height: 300}}>

            </View>
          )
        }}
        renderItem={({ item, index }) => (
          
          <View style={{
            width: ITEM_WIDTH,
            position: 'relative',
            paddingHorizontal:24
          }}>
            <View style={{
              marginHorizontal: 0,
              height: 300,
              elevation: 20,
              borderRadius: 34,
              borderColor: 'transparent'
            }}>
            
              <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 34
              }}
              source={{url: `${APP_POSTER_URL}${item.poster_path}`}}/>
              {/* {console.log( `ПУТЬ: ${APP_POSTER_URL}${item.poster_path}`)} */}
              {/* <Text style={{color: '#ffffff'}}>
              {item.title}
            </Text> */}
            </View>
           
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  )
}