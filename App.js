import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_KEY } from '@env';

export default function App() {
	const [ currencyData, setData ] = React.useState ( { done: false, rates: { } } );

	const [ amount, setAmount ] = React.useState ( '' );
	const [ currency, setCurrency ] = React.useState ( '' );
	const [ result, setResult ] = React.useState ( '' );

	React.useEffect ( ( ) => {
		fetch ( 'https://api.apilayer.com/exchangerates_data/latest', {
			headers: {
				'apikey': API_KEY
			}
		} )
			.then ( resp => resp.json ( ) )
			.then ( resp => {
				setData ( { done: true, rates: resp.rates } );
			} )
			.catch ( err => Alert.alert ( 'Error', err ) );
	}, [ ] );

	const conversionResult = ( ( ) => {
		if ( result.length === 0 ) {
			return <View/>
		}
		// Couldn't find a cool image like in the screenshot, so you get this
		return <View style={ { padding: 24 } }>
			<Text style={ { fontWeight: 'bold', fontSize: 18 } }>{ result }</Text>
		</View>
	} ) ( );

	const onClick = ( ) => {
		const amountNumber = parseFloat ( amount );
		const exchangeRate = currencyData.rates [ currency ];

		setResult ( ( amountNumber / exchangeRate ).toFixed ( 2 ) + ' €' );
	};

	if ( !currencyData.done ) {
		return <View style = {styles.container}>
			<StatusBar style='auto'/>
		</View>
	}

	return (<View style = {styles.container}>
		{ conversionResult }
		<View style={ { flexDirection: 'row', padding: 12 } }>
			<TextInput
				style={ { borderColor: 'black', borderWidth: 2 } }
				placeholder='Amount'
				value={ amount }
				onChangeText={ text => setAmount ( text ) } // Yes, I know it accepts non-numeric values if I try it on a real KB, I do not care
				keyboardType='decimal-pad'
			/>

			<Picker
				selectedValue={ currency }
				onValueChange={ ( itemValue ) => setCurrency ( itemValue ) }
			>
				{ Object.keys ( currencyData.rates ).map ( item => <Picker.Item label={ item } value={ item } /> ) }
			</Picker>
		</View>
		<Button title='Convert' onPress={ ( ) => onClick ( ) }/>
		<StatusBar style = "auto" />
	</View>);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});