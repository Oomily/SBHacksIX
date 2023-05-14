import { View, Text } from 'react-native';

export default function MenuItem(props){
  let name = props.name;
  let category = props.category;
  return (
    <View>
        <View className='item-container' 
        style={{backgroundColor:"lavender",
                display: "flex",
                flexDirection:"row",
                flexWrap: "wrap",
                gap: 10,
                marginVertical: 5,
                marginHorizontal: 8,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "whitesmoke",
                borderRadius: 2}}>
            <Text style = {{fontWeight: 'bold'}}>{category}  |</Text>
            <Text>{name}</Text>
        </View>
    </View>
  )
};