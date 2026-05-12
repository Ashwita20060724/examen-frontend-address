import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import TextError from '../../components/TextError'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'
import * as GlobalStyles from '../../styles/GlobalStyles'


export default function AddressScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)

  useEffect(() => {
    fetchAddressDetails()
  }, [route])

  const fetchAddressDetails =  async() => {
    try{
      const addresses = await getAddresses(route.params.id)
      setAddresses(addresses)
    } catch (error) {
      showMessage({
        message: `Error retrieving restaurant addresses. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const handleSetDefault = async(id) => {
    try{
      await setDefault(id)
      showMessage({
        message: `Address set as default successfully`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      fetchAddressDetails()
    } catch(error) {
      showMessage({
        message: `Error setting address as default. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const handleDelete = async(address) => {
    try{
      await deleteAddress(address.id)
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address deleted successfully`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      fetchAddressDetails()
    } catch(error) {
      showMessage({
        message: `Error deleting address. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }


  // RF1: renderiza cada dirección de la lista
  const renderAddress = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Alias + estrella si es la predeterminada */}
        <TextSemiBold textStyle={styles.alias}>{item.alias}</TextSemiBold>
        {item.isDefault && (
          <Ionicons name='star' size={18} color={GlobalStyles.brandPrimary} />
        )}
      </View>

      {/* Datos de la dirección */}
      <TextRegular>{item.street}</TextRegular>
      <TextRegular>{item.zipCode} {item.city}, {item.province}</TextRegular>

      <View style={styles.actionsRow}>
        {/* RF3: botón para marcar como predeterminada — solo si no lo es ya */}
        {!item.isDefault && (
          <Pressable
            onPress={() => handleSetDefault(item.id)}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: pressed ? GlobalStyles.brandPrimaryTap : GlobalStyles.brandPrimary }
            ]}
          >
            <Ionicons name='star-outline' size={16} color='white' />
            <TextRegular textStyle={styles.actionText}>Set default</TextRegular>
          </Pressable>
        )}

        {/* RF4: botón de borrado — abre el modal de confirmación */}
        <Pressable
          onPress={() => setAddressToBeDeleted(item)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: pressed ? GlobalStyles.brandPrimaryTap : GlobalStyles.brandSecondary }
          ]}
        >
          <Ionicons name='trash-outline' size={16} color='white' />
          <TextRegular textStyle={styles.actionText}>Delete</TextRegular>
        </Pressable>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <TextRegular textStyle={styles.emptyText}>
      You have no shipping addresses yet.
    </TextRegular>
  )

  const renderHeader = () => (
    <Pressable
      onPress={() => navigation.navigate('CreateAddressScreen')}
      style={({ pressed }) => [
        styles.createButton,
        { backgroundColor: pressed ? GlobalStyles.brandPrimaryTap : GlobalStyles.brandPrimary }
      ]}
    >
      <Ionicons name='add-circle-outline' size={20} color='white' />
      <TextSemiBold textStyle={styles.createButtonText}>Add new address</TextSemiBold>
    </Pressable>
  )

  return (
    <>
      {error && <TextError>{error}</TextError>}

      <FlatList
        data={addresses}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAddress}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
      />

      {/* Modal de confirmación de borrado (RF4) */}
      <DeleteModal
        isVisible={addressToBeDeleted !== null}
        onCancel={() => setAddressToBeDeleted(null)}
        onConfirm={() => handleDelete(addressToBeDeleted)}
      >
        <TextRegular>
          Are you sure you want to delete "{addressToBeDeleted?.alias}"?
        </TextRegular>
      </DeleteModal>
    </>
  )
}


const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  alias: {
    fontSize: 16
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4
  },
  actionText: {
    color: 'white',
    fontSize: 13
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 40,
    marginBottom: 16,
    gap: 6
  },
  createButtonText: {
    color: 'white',
    fontSize: 15
  }
})