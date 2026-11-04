// Admin calls for the new event flow: orders, app settings, pop-ups,
// districts and linking existing data to event types. Same behaviour as
// dashHttpService: an API error or a failed request shows an alert, and the
// caller gets { data } or { error }.
import appHttpService from "../adminHttpService";
import Swal from "sweetalert2";

const url = (path) => `${process.env.REACT_APP_APIENDPOINT}api/admin/${path}`;

const alert = (title) =>
  Swal.fire({
    title: title || "Error!",
    icon: "error",
    confirmButtonText: "Okay",
    confirmButtonColor: "#e25829",
  });

async function call(request) {
  try {
    const { data } = await request();
    if (data?.error) alert(data?.message);
    return { data };
  } catch (error) {
    if (error.response) alert(error?.response?.data?.message);
    return { error };
  }
}

const post = (path, body) => call(() => appHttpService.post(url(path), body));
const get = (path) => call(() => appHttpService.get(url(path)));

// Orders. status: PROVIDERS_ACCEPTED | CONFIRMED | COMPLETED | CANCELLED
export const getEventOrders = (body) => post("getEventOrders", body);
export const setEventOrderStatus = (body) => post("setEventOrderStatus", body);

// App settings
export const viewAppConfig = () => get("viewAppConfig");
export const updateAppConfig = (body) => post("updateAppConfig", body);

// Pop-ups
export const getAllPopups = (body) => post("getAllPopups", body);
export const createPopup = (body) => post("createPopup", body);
export const editPopup = (body) => post("editPopup", body);
export const changePopupStatus = (body) => post("changePopupStatus", body);
export const deletePopup = (id) => get(`deletePopup/${id}`);

// Districts
export const getAllDistricts = (body) => post("getAllDistricts", body);
export const addDistrict = (body) => post("addDistrict", body);
export const editDistrict = (body) => post("editDistrict", body);
export const deleteDistrict = (id) => get(`deleteDistrict/${id}`);

// Linking to event types
export const setOccasionEventTypes = (body) => post("setOccasionEventTypes", body);
export const setPackageDetails = (body) => post("setPackageDetails", body);
export const setCategoryEventTypes = (body) => post("setCategoryEventTypes", body);

// Lists for the pickers
export const getCityList = () => get("getCities");
export const getOccasionList = () => post("getAllOccasions", {});
export const getOfferList = () => get("getAllOffer");
export const getCategoryList = () => post("getCategories", {});
export const getEventTypeList = () =>
  post("getAllPartyTypes", { page: 1, pageSize: 200 });

// Uploads one image (JPEG or PNG) and returns its URL, or null
export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await post("imageUpload", form);
  return data && !data.error ? data.results?.obj?.[0] || null : null;
}
