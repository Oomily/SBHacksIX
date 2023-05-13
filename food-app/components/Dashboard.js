import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = "https://jsonplaceholder.typicode.com/posts";
    
    return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.movies;
        })
        .catch((error) => {
            console.error(error);
        });
}

