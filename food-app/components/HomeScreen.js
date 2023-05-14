import {Image, View, FlatList, Text} from 'react-native'
import React, {useEffect, useState} from 'react';
let currentDate = new Date().toJSON().slice(0, 10);

export default function HomeScreen(){
    const [specials, populateSpecials] = useState([]);
    const [num, avgMeal] = useState([]);

useEffect(() => {getSpecials();}, []);

const getSpecials = async () => {
    let data = []
    try {
        const response = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
            }
        });
        data = await response.json();
    } catch (error) {
            console.error(error);
    }
    dining_halls = []
    for (let i = 0; i < data.length; i++){
      dining_halls.push(data[i]["code"])
    }
    avail_meals = []
    json = []
    for(let i = 0; i < dining_halls.length; i++){
        try {
            const meal = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/'+dining_halls[i], {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
                }
            });
                json = await meal.json();
            } 
        catch (error) {
            console.error(error);
        }
        avail_meals1 = []
        for (let j = 0; j < json.length; j++){
            avail_meals1.push(json[j]["code"]);
        }
        avail_meals.push(avail_meals1);
        avail_meals1 = [];
    }
    temp_specials = []
    
    for (let m = 0; m < dining_halls.length; m++){
        for(let n = 0; n < avail_meals[m].length; n++){
            try {
                const response = await fetch("https://api.ucsb.edu/dining/menu/v1/"+currentDate+"/"+dining_halls[m]+"/"+avail_meals[m][n], {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
                    }
                });
                data = await response.json();
                temp_specials.push(data[0]['name']);
            } catch (error) {
                    console.error(error);
            }
        }
    }
    populateSpecials(temp_specials);
    if(avail_meals[0].length == 3){
        avgMeal(3);
    }
    else{
        avgMeal(2);
    }
}

  
  // RN Code
  const Item = ({ item }) => {
    return <View style={styles.item}>{item.icon}</View>;
  };
itemData = []

if(num == 3){
    itemData = [
        {icon: <Image style={styles.image} source={require("../assets/Carrillo.jpg")}/>},
        {icon: <Text style={styles.text}>Carrillo {"\n"}{specials[0]}{"\n"}{specials[1]}{"\n"}{specials[2]}</Text>},
        {icon: <Image style={styles.image} source={require("../assets/DLG.jpg")}/>},
        {icon: <Text style={styles.text}>De la Guerra{"\n"}{specials[3]}{"\n"}{specials[4]}{"\n"}{specials[5]}</Text>},
        {icon: <Image style={styles.image} source={require("../assets/Ortega.jpg")}/>},
        {icon: <Text style={styles.text}>Ortega{"\n"}{specials[6]}{"\n"}{specials[7]}</Text>},  
        {icon: <Image style={styles.image} source={require("../assets/Portola.jpg")}/>},  
        {icon: <Text style={styles.text}>Portola{"\n"}{specials[8]}{"\n"}{specials[9]}{"\n"}{specials[10]}</Text>},
    ];
}
else if (num == 2){
    itemData = [
        {icon: <Image style={styles.image} source={require("../assets/Carrillo.jpg")}/>},
        {icon: <Text style={styles.text}>Carrillo {"\n"}{specials[0]}{"\n"}{specials[1]}</Text>},
        {icon: <Image style={styles.image} source={require("../assets/DLG.jpg")}/>},
        {icon: <Text style={styles.text}>De la Guerra{"\n"}{specials[2]}{"\n"}{specials[3]}</Text>},
        {icon: <Image style={styles.image} source={require("../assets/Ortega.jpg")}/>},
        {icon: <Text style={styles.text}>Ortega{"\n"}No meals today!</Text>},  
        {icon: <Image style={styles.image} source={require("../assets/Portola.jpg")}/>},  
        {icon: <Text style={styles.text}>Portola{"\n"}{specials[4]}{"\n"}{specials[5]}</Text>},
    ];
}
else{
    itemData = [
        {icon: <Image style={styles.image} source={require("../assets/Carrillo.jpg")}/>},
        {icon: <Text style={styles.text}>Carrillo</Text>},
        {icon: <Image style={styles.image} source={require("../assets/DLG.jpg")}/>},
        {icon: <Text style={styles.text}>De la Guerra</Text>},
        {icon: <Image style={styles.image} source={require("../assets/Ortega.jpg")}/>},
        {icon: <Text style={styles.text}>Ortega</Text>},  
        {icon: <Image style={styles.image} source={require("../assets/Portola.jpg")}/>},  
        {icon: <Text style={styles.text}>Portola</Text>},
    ];
}

  return (
    <View style={styles.app}>
    <FlatList
        data={itemData}
        numColumns={2}
        renderItem={Item}
    />
  </View>
    );
}
const styles = {
    app: {
      flex: 2,
      backgroundColor: "whitesmoke",
    },
    item: {
      flex: 1,
      flex_direction:"row",
      maxWidth: "50%", // 100% devided by the number of rows you want
      justifyContent: "center",
      paddingVertical: 5,
      marginHorizontal: 8,
      marginVertical: 4,
      borderWidth: 0,
      color: "#ffff"
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: "center",
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#ffff"
      },
    text:{
        flex:1,
        flex_direction: "row",
        marginLeft: 5,
        paddingTop: 10,
        fontSize: 18,
        lineHeight: 20,
        color: "black",
        justifyContent: "center",
        alignItems: 'center', //Centered horizontally
        fontVariant:"small-caps"
    }
  };
