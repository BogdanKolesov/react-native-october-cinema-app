import {SafeAreaView, StatusBar, View, Text, Image, TextInput} from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'

export default function Home() {
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
    </SafeAreaView>
  )
}