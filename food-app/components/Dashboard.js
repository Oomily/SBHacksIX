import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Dashboard() {
    const [data, setData] = useState([]);
    // KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
    const getData = async () => {
      try {
        const response = await fetch('https://api.ucsb.edu/dining/menu/v1/2022-12-06', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
          }
        });
        const json = await response.json();
        // console.log(json);
        // console.log(json[0]["name"]);
        setData(json);
        console.log("\n", data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
    
    data.map((dining_halls) => {
      console.log(dining_halls["code"]);
    })
  
    //BUTTON/////////////////

    const handleMenuOne = () => {
        console.log('clicked one');
      };
    
      const handleMenuTwo = () => {
        console.log('clicked two');
      };
    
      return (
        <Dropdown
          trigger={<button>Dropdown</button>}
          menu={[
            <button onClick={handleMenuOne}>Menu 1</button>,
            <button onClick={handleMenuTwo}>Menu 2</button>,
          ]}
        />
      );
    };
    
    const Dropdown = ({ trigger, menu }) => {
      const [open, setOpen] = React.useState(false);
    
      const handleOpen = () => {
        setOpen(!open);
      };
    
      return (
        <div className="dropdown">
          {React.cloneElement(trigger, {
            onClick: handleOpen,
          })}
          {open ? (
            <ul className="menu">
              {menu.map((menuItem, index) => (
                <li key={index} className="menu-item">
                  {React.cloneElement(menuItem, {
                    onClick: () => {
                      menuItem.props.onClick();
                      setOpen(false);
                    },
                  })}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
}

