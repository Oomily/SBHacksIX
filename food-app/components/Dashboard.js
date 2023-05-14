import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Text, Button, View, CheckBox, TextInput, SafeAreaView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import MenuItem from './MenuItem';
import MealButton from './MealButton';
// KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
let allergies = []; 
let preferences = [];
//let parsedMeals = [];
let currentDate = new Date().toJSON().slice(0, 10);
////////////////////////////////////////////////////////////////filtering
const filterAllergies = (nameOfItem) => {
    for(let i = 0; i < allergies.length; i++){
        if(nameOfItem.toLowerCase().includes(allergies[i])) return true;
    }
    return false;
};

const filterPreferences = (nameOfItem) => {
  for(let i = 0; i < preferences.length; i++){
      if(nameOfItem.toLowerCase().includes(preferences[i])) return true;
  }
  return false;
};
/////////////////////////////////////////////////////////////////////////
export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = React.useState("");
    const [clear, callClear] = useState(false);
    // const [meal, setMeal] = useState(""); //default is empty

    info = []
    for (let i = 0; i < data.length; i++){
      info.push({key:i, value:(data[i])["name"]})
    }

    const getData = async () => {
            try {
            const response = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/', {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
                }
            });
            const json = await response.json();
            setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
    // FUNCTION THAT RETURNS MEAL ITEMS //////////////////////////////////////////////////
    // const buttons = parsedMeals.map((mel, index) => {
    //   if(selected.length > 0){
    //     return (
    //       <MealButton meal={parsedMeals} dining={selected}></MealButton>
    //     )
    //   }
    // })
    /*
    const getMealType = async (selected) => {
        let dining = "";
        let json = [];
        parsedMeals = []; // set parsedMeals to empty everything we get MealType bc it's a global var
        for(let i = 0; i < selected.length; i++){
            if(selected[i] == " "){
                dining += "-";
            }
            else{ dining += selected[i].toLowerCase();}
        }
        try {
            console.log("DINING:", dining)
            const meal = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/'+dining, {
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
        console.log(json)
        for (let i = 0; i < json.length; i++){
          parsedMeals.push(json[i]["code"]);
        } 
    }
 */
/*
const getMenu = async (selected, meal) => {
          let dining = "";
          for(let i = 0; i < selected.length; i++){
            if(selected[i] == " "){
              dining += "-";
            }
            else{ dining += selected[i].toLowerCase();}
          }
          let url = "https://api.ucsb.edu/dining/menu/v1/"+currentDate+"/"+dining+"/"+meal;
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
              }
            });
            const json = await response.json();
            setMeal(meal);
            setMenu(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
 */
    const getMenu = async (selected) => { //getMenu(selected, meal);
          let dining = "";
          for(let i = 0; i < selected.length; i++){
            if(selected[i] == " "){
              dining += "-";
            }
            else{ dining += selected[i].toLowerCase();}
          }
          let url = "https://api.ucsb.edu/dining/menu/v1/"+currentDate+"/"+dining+"/dinner";
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
              }
            });
            const json = await response.json();
            setMenu(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
    // Gets names of all dining commons
    useEffect(() => {
      if(data.length == 0) {getData();}}, []);
  
    //   Gets new menu when it updates
    useEffect(() => {
      if(selected.length > 0){ //&& parsedMeals.length > 0
        getMenu(selected); //getMenu(selected, meal);
        console.log("\n\nGetting initial menu\n\n");
    }
    else{ return;}},[]);
  // FUNCTION THAT RETURNS MENU ITEMS //////////////////////////////////////////////////
  // MAKE SURE TO ADD IN EXTRA CONDITIONAL TO HAVE A MEAL TYPE  
  const items = menu.map((food, index) => {
      if(selected.length > 0 && (filterAllergies(food["name"].toLowerCase()) == false) 
      && (preferences.length == 0 || filterPreferences(food["name"].toLowerCase()) == true)){
        return (
          <MenuItem category={food["station"]} name={food["name"]}/>
          // REPLACED <View>
          //   <Text>{food["station"]}: {food["name"]}</Text>
          // </View>
        )
      }
    });
///////////////////////////////////////////////////////////////////////////////
      function Allergies(){
        const appendAllergies = (text) => {
            if(text.length > 0 && allergies.includes(text)==false){
                allergies.push(text.toLowerCase());
                if(selected.length > 0) getMenu(selected); //getMenu(selected, meal);
                console.log("Allergies: " + allergies);
            }
        }
        return (
            <View>
                <TextInput
                onSubmitEditing={(value) => appendAllergies(value.nativeEvent.text)}
                placeholder="restrictions"
                autoCapitalize='none'
                />
            </View>
        )
    };
    function Preferences(){
      const appendPreferences = (text) => {
          if(text.length > 0 && preferences.includes(text)==false){
              preferences.push(text.toLowerCase());
              if(selected.length > 0) getMenu(selected); //getMenu(selected, meal);
              console.log("Preferences: " + preferences);
          }
      }
      return (
          <View>
              <TextInput
              onSubmitEditing={(value) => appendPreferences(value.nativeEvent.text)}
              placeholder="preference"
              autoCapitalize='none'
              />
          </View>
      )
  };
  function Reset(){
    // clears filters
    const clearFilter = () => {
      allergies = [];
      preferences = [];
      if(selected.length > 0) {getMenu(selected);} //getMenu(selected, meal);
    };
    return(
      <View>
        <Button
      onPress={() => {
        callClear();
        clearFilter();
      }}
      title="Reset"
      color="blue"/>
      </View>
    )
  };
///////////////////////////////////////////////////////////////////////////////
    return(
      <View style={{paddingTop: 40}}>
        <StatusBar barStyle="light_content"/>
  
        <SelectList
            onSelect={() => getMenu(selected)}
            // replace ^^ with getMealType(selected);
            setSelected={(val) => {
              setSelected(val);
            }} 
            data={info}
            boxStyles={{borderRadius:0}} //override default styles
            save="value"
        />
        <View style={{flexDirection: 'row', gap: 40, margin: 10, 
            backgroundColor:"white", alignSelf:"center",
            alignItems: "center", borderRadius: 5, fontSize:15}}>
              <Text style={{paddingLeft:8, fontSize:15}}>Filter:</Text>
              <Allergies/>
              <Preferences/>
              <Reset/>
        </View>
        {/* buttons */}
        {items}
      </View>
    );
}



