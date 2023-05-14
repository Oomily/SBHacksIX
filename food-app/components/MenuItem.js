import { View, Text } from 'react-native';

export default function MenuItem(props){
  let name = props.name;
  let category = props.category;
  return (
    <View>
        <View className='item-container' 
        style={{backgroundColor:"lightgreen",
                display: "flex",
                flexDirection:"row",
                flexWrap: "wrap",
                gap: 10,
                marginVertical: 3,
                marginHorizontal: 15,
                padding: 5,
                borderRadius: 1,
                borderColor: "black",
                borderRadius: 5}}>
            <Text style = {{fontWeight: 'bold'}}>{category}  |</Text>
            <Text>{name}</Text>
        </View>
    </View>
  )
};