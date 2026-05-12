import React, { useEffect } from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch  } from 'react-native' //NOTESE EL USO DE SWITCH
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled } from '../../styles/GlobalStyles'
import * as GlobalStyles from '../../styles/GlobalStyles'

const validationSchema = yup.object().shape({
  alias: yup.string().max(255, 'Alias too long').required('Alias is required'),
  calle: yup.string().max(255, 'Street too long').required('Street is required'),
  ciudad: yup.string().max(255,'City too long').required('City is required'),
  provincia: yup.string().max(255, 'Province too long').nullable(),
  codigoPostal: yup.number().positive('Please provide a positive postal code value').required('Postal code is required')
})
//TODO
export default function AddressDetailScreen({ navigation, route }) {
  const [initialRestaurantValues, setInitialRestaurantValues] = useState({ alias: '', calle: '', ciudad: '',provincia:'', postalCode: ''})
  const [backendError, setBackendError] = useState([])

  const handleSubmit = async (values) => {
    try{
      await addAddress(values)
      showMessage({
        message: `Address created successfully`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('AddressScreen')
    } catch(error) {
      showMessage({
        message: `Address not created`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style = {styles.container}>
              <TextSemibold textStyle={tyles.title}> New shipping address </TextSemibold>
              <InputItem name='alias' label='Alias' />
              <InputItem name='calle' label='Street' />
              <InputItem name='ciudad' label='City' />
              <InputItem name='codigoPostal' label='Zip Code' />
              <InputItem name='provincia' label='Province' />

              <Pressable
                onPress = {handleSubmit}
                disabled = {!isValid}
                style = {({pressed}) => [
                  {
                    backgroundColor: !isValid 
                    ? GlobalStyles.brandSuccessDisabled 
                    : pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button
                ]}
              >
                <TextSemibold textStyle={styles.buttonText}> Save address </TextSemibold>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  toggleContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop: 20,
 },
 toggleLabel: {
   fontSize: 16,
 },
})
