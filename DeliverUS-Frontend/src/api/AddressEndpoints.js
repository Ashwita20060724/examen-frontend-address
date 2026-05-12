import { get, post, patch, destroy } from './helpers/ApiRequestsHelper'

//GET /shippingaddresses: obtiene todas las direcciones de envío del usuario
function getAddresses (data) {
  return get('shippingaddresses', data)
}

//POST /shippingaddresses: crear nuevas direcciones de envío del usuario
function addAddress (data) {
  return post('shippingaddresses', data)
}

//PATCH /shippingaddresses/:shippingAddressesId/default: marca una dirección como predeterminada
function setDefault (id) {
  return patch(`shippingaddresses/${id}/default`)
}

//DELETE /shippingaddresses/:shippingAddressId: elimina la dirección de un usuario
function deleteAddress (id) {
  return destroy(`shippingaddresses/${id}`)
}

export { getAddresses, addAddress, setDefault, deleteAddress  }
