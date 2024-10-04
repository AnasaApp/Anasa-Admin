import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Loader } from "rsuite";
import Swal from "sweetalert2";
import { AddVendor, getCities } from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import Select from "react-select";

const AddUser = () => {
  const [slide, setSlide] = useState("VM");
  const [sideBar, setSideBar] = useState();
  const [loader, setLoader] = useState("");
  const [files, setFiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onFileSelection = (e, key) => {
    console.log(e);
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    let { data } = await getCities();
    console.log(data);
    if (!data.error) {
      setCities(data?.results?.cities);
      let values = data?.results?.cities;
      let options = values?.map((item, i) => ({
        value: item?._id,
        label: item?.city,
      }));
      setCities(options);
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedCities(selectedOptions);
  };

  const onSave = async (data) => {
    setLoader(true);
    const cityValues = selectedCities.map((city) => city.value);
    const formData = new FormData();
    formData.append("shop_cover_image", files?.shop_cover_image);
    formData.append("full_name", data?.full_name.trim());
    formData.append("shop_name", data?.shop_name.trim());
    formData.append("shop_address", data?.shop_address.trim());
    formData.append("phone_number", data?.phone_number);
    formData.append("customer_contact_number", data?.customer_contact_number);
    formData.append("city", data?.city.trim());
    formData.append("building_name", data?.building_name?.trim());
    formData.append("country_code", data?.country_code);
    formData.append("locality", data?.locality.trim());
    formData.append("serviceableCity", JSON.stringify(cityValues));
    formData.append("email", data?.email.trim());
    formData.append("signed_contract", files?.signed_contract);
    formData.append("trade_licence_copy", files?.trade_licence_copy);
    formData.append("commission", data?.commission);
    await AddVendor(formData).then((res) => {
      console.log(res.data);
      if (res.data.message === "Vendor Created Successfully") {
        Swal.fire({
          title: "Vendor Created Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
        navigate("/Admin/Dashboard/Vendor-Management");
      }
    });
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row vendor-management justify-content-center">
          <div className="col-12 design_outter_comman recent_orders shadow">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Add Vendor User</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-4 Pending-view-main">
                <form
                  className="row py-2 form-design "
                  onSubmit={handleSubmit(onSave)}
                >
                  <div className="form-group col-4 mb-4 choose_file position-relative">
                    <span>Upload Image</span>{" "}
                    <label htmlFor="upload_video">
                      <i className="fa fa-camera me-1" />
                      Choose File
                    </label>
                    <input
                      type="file"
                      className={classNames("form-control mx-3", {
                        "is-invalid": errors.shop_cover_image,
                      })}
                      accept="image/*"
                      name="shop_cover_image"
                      id="upload_video"
                      {...register("shop_cover_image", {
                        required: "*Please Upload Image!",
                      })}
                      onChange={(e) => onFileSelection(e, "shop_cover_image")}
                    />
                    {errors.shop_cover_image && (
                      <small className="errorText text-start">
                        {errors.shop_cover_image?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Vendor's Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.full_name,
                      })}
                      name="full_name"
                      id="name"
                      {...register("full_name", {
                        required: "*Vendor Name is Required!",
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "maximium 20 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in Vendor Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.full_name && (
                      <small className="errorText mx-1">
                        {errors.full_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Mobile Number</label>
                    <input
                      type="number"
                      className={classNames("form-control ", {
                        "is-invalid": errors.phone_number,
                      })}
                      name="phone_number"
                      id="name"
                      {...register("phone_number", {
                        required: "*Phone Number is Required!",

                        maxLength: {
                          value: 12,
                          message: "maximium 12 Characters",
                        },
                        minLength: 10,
                      })}
                    />
                    {errors.phone_number && (
                      <small className="errorText mx-1 ">
                        {errors.phone_number?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Shop Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.shop_name,
                      })}
                      name="shop_name"
                      id="name"
                      {...register("shop_name", {
                        required: "*Shop Name is Required!",
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "maximium 20 Characters",
                        },
                        minLength: {
                          value: 3,
                          message: "Minimium 3 letters Should be in Shop Name", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.shop_name && (
                      <small className="errorText mx-1 ">
                        {errors.shop_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Email Id</label>
                    <input
                      type="email"
                      className={classNames("form-control ", {
                        "is-invalid": errors.email,
                      })}
                      name="email"
                      id="name"
                      {...register("email", {
                        required: "*Email is Required!",
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid email address!",
                        },
                        maxLength: {
                          value: 30,
                          message: "maximium 30 Characters",
                        },
                      })}
                    />
                    {errors.email && (
                      <small className="errorText mx-1 ">
                        {errors.email?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Customer Contact Number</label>
                    <input
                      type="number"
                      className={classNames("form-control ", {
                        "is-invalid": errors.customer_contact_number,
                      })}
                      name="customer_contact_number"
                      id="name"
                      {...register("customer_contact_number", {
                        required: "*Contact Number is Required!",

                        maxLength: {
                          value: 12,
                          message: "maximium 12 Characters",
                        },
                        minLength: 10,
                      })}
                    />
                    {errors.customer_contact_number && (
                      <small className="errorText mx-1 ">
                        {errors.customer_contact_number?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Shop Address</label>
                    <input
                      type="text"
                      className={classNames("form-control ", {
                        "is-invalid": errors.shop_address,
                      })}
                      name="shop_address"
                      id="name"
                      {...register("shop_address", {
                        required: "*Shop Address is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character not allowed!",
                        },
                        maxLength: {
                          value: 80,
                          message: "maximium 80 Characters",
                        },
                        minLength: {
                          value: 6,
                          message: "Minimium 6 letters Should be in Address!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.shop_address && (
                      <small className="errorText mx-1">
                        {errors.shop_address?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Building Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.building_name,
                      })}
                      name="building_name"
                      id="name"
                      {...register("building_name", {
                        required: "*Building Name is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 50,
                          message: "maximium 50 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in building Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.building_name && (
                      <small className="errorText mx-1 ">
                        {errors.building_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Locality</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.locality,
                      })}
                      name="locality"
                      id="name"
                      {...register("locality", {
                        required: "*Locality is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "*Special Character not allowed!",
                        },
                        maxLength: {
                          value: 50,
                          message: "maximium 50 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in locality Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.locality && (
                      <small className="errorText mx-1 ">
                        {errors.locality?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-3 mb-4">
                    <label htmlFor="">City</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.city,
                      })}
                      name="city"
                      id="name"
                      {...register("city", {
                        required: "*City is Required!",
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 30,
                          message: "maximium 30 Characters",
                        },
                      })}
                    />
                    {errors.city && (
                      <small className="errorText mx-1 ">
                        {errors.city?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-3 mb-4">
                    <label htmlFor="">Country Code</label>
                    <select
                      name="country_code"
                      className="form-select form-control"
                      {...register("country_code", {
                        required: "*Code is Required!",
                      })}
                      id=""
                    >
                      <optgroup>
                        <option selected>Select country code....</option>
                        <option data-countryCode="DZ" value="213">
                          Algeria (+213)
                        </option>
                        <option data-countryCode="AD" value="376">
                          Andorra (+376)
                        </option>
                        <option data-countryCode="AO" value="244">
                          Angola (+244)
                        </option>
                        <option data-countryCode="AI" value="1264">
                          Anguilla (+1264)
                        </option>
                        <option data-countryCode="AG" value="1268">
                          Antigua &amp; Barbuda (+1268)
                        </option>
                        <option data-countryCode="AR" value="54">
                          Argentina (+54)
                        </option>
                        <option data-countryCode="AM" value="374">
                          Armenia (+374)
                        </option>
                        <option data-countryCode="AW" value="297">
                          Aruba (+297)
                        </option>
                        <option data-countryCode="AU" value="61">
                          Australia (+61)
                        </option>
                        <option data-countryCode="AT" value="43">
                          Austria (+43)
                        </option>
                        <option data-countryCode="AZ" value="994">
                          Azerbaijan (+994)
                        </option>
                        <option data-countryCode="BS" value="1242">
                          Bahamas (+1242)
                        </option>
                        <option data-countryCode="BH" value="973">
                          Bahrain (+973)
                        </option>
                        <option data-countryCode="BD" value="880">
                          Bangladesh (+880)
                        </option>
                        <option data-countryCode="BB" value="1246">
                          Barbados (+1246)
                        </option>
                        <option data-countryCode="BY" value="375">
                          Belarus (+375)
                        </option>
                        <option data-countryCode="BE" value="32">
                          Belgium (+32)
                        </option>
                        <option data-countryCode="BZ" value="501">
                          Belize (+501)
                        </option>
                        <option data-countryCode="BJ" value="229">
                          Benin (+229)
                        </option>
                        <option data-countryCode="BM" value="1441">
                          Bermuda (+1441)
                        </option>
                        <option data-countryCode="BT" value="975">
                          Bhutan (+975)
                        </option>
                        <option data-countryCode="BO" value="591">
                          Bolivia (+591)
                        </option>
                        <option data-countryCode="BA" value="387">
                          Bosnia Herzegovina (+387)
                        </option>
                        <option data-countryCode="BW" value="267">
                          Botswana (+267)
                        </option>
                        <option data-countryCode="BR" value="55">
                          Brazil (+55)
                        </option>
                        <option data-countryCode="BN" value="673">
                          Brunei (+673)
                        </option>
                        <option data-countryCode="BG" value="359">
                          Bulgaria (+359)
                        </option>
                        <option data-countryCode="BF" value="226">
                          Burkina Faso (+226)
                        </option>
                        <option data-countryCode="BI" value="257">
                          Burundi (+257)
                        </option>
                        <option data-countryCode="KH" value="855">
                          Cambodia (+855)
                        </option>
                        <option data-countryCode="CM" value="237">
                          Cameroon (+237)
                        </option>
                        <option data-countryCode="CA" value="1">
                          Canada (+1)
                        </option>
                        <option data-countryCode="CV" value="238">
                          Cape Verde Islands (+238)
                        </option>
                        <option data-countryCode="KY" value="1345">
                          Cayman Islands (+1345)
                        </option>
                        <option data-countryCode="CF" value="236">
                          Central African Republic (+236)
                        </option>
                        <option data-countryCode="CL" value="56">
                          Chile (+56)
                        </option>
                        <option data-countryCode="CN" value="86">
                          China (+86)
                        </option>
                        <option data-countryCode="CO" value="57">
                          Colombia (+57)
                        </option>
                        <option data-countryCode="KM" value="269">
                          Comoros (+269)
                        </option>
                        <option data-countryCode="CG" value="242">
                          Congo (+242)
                        </option>
                        <option data-countryCode="CK" value="682">
                          Cook Islands (+682)
                        </option>
                        <option data-countryCode="CR" value="506">
                          Costa Rica (+506)
                        </option>
                        <option data-countryCode="HR" value="385">
                          Croatia (+385)
                        </option>
                        <option data-countryCode="CU" value="53">
                          Cuba (+53)
                        </option>
                        <option data-countryCode="CY" value="90392">
                          Cyprus North (+90392)
                        </option>
                        <option data-countryCode="CY" value="357">
                          Cyprus South (+357)
                        </option>
                        <option data-countryCode="CZ" value="42">
                          Czech Republic (+42)
                        </option>
                        <option data-countryCode="DK" value="45">
                          Denmark (+45)
                        </option>
                        <option data-countryCode="DJ" value="253">
                          Djibouti (+253)
                        </option>
                        <option data-countryCode="DM" value="1809">
                          Dominica (+1809)
                        </option>
                        <option data-countryCode="DO" value="1809">
                          Dominican Republic (+1809)
                        </option>
                        <option data-countryCode="EC" value="593">
                          Ecuador (+593)
                        </option>
                        <option data-countryCode="EG" value="20">
                          Egypt (+20)
                        </option>
                        <option data-countryCode="SV" value="503">
                          El Salvador (+503)
                        </option>
                        <option data-countryCode="GQ" value="240">
                          Equatorial Guinea (+240)
                        </option>
                        <option data-countryCode="ER" value="291">
                          Eritrea (+291)
                        </option>
                        <option data-countryCode="EE" value="372">
                          Estonia (+372)
                        </option>
                        <option data-countryCode="ET" value="251">
                          Ethiopia (+251)
                        </option>
                        <option data-countryCode="FK" value="500">
                          Falkland Islands (+500)
                        </option>
                        <option data-countryCode="FO" value="298">
                          Faroe Islands (+298)
                        </option>
                        <option data-countryCode="FJ" value="679">
                          Fiji (+679)
                        </option>
                        <option data-countryCode="FI" value="358">
                          Finland (+358)
                        </option>
                        <option data-countryCode="FR" value="33">
                          France (+33)
                        </option>
                        <option data-countryCode="GF" value="594">
                          French Guiana (+594)
                        </option>
                        <option data-countryCode="PF" value="689">
                          French Polynesia (+689)
                        </option>
                        <option data-countryCode="GA" value="241">
                          Gabon (+241)
                        </option>
                        <option data-countryCode="GM" value="220">
                          Gambia (+220)
                        </option>
                        <option data-countryCode="GE" value="7880">
                          Georgia (+7880)
                        </option>
                        <option data-countryCode="DE" value="49">
                          Germany (+49)
                        </option>
                        <option data-countryCode="GH" value="233">
                          Ghana (+233)
                        </option>
                        <option data-countryCode="GI" value="350">
                          Gibraltar (+350)
                        </option>
                        <option data-countryCode="GR" value="30">
                          Greece (+30)
                        </option>
                        <option data-countryCode="GL" value="299">
                          Greenland (+299)
                        </option>
                        <option data-countryCode="GD" value="1473">
                          Grenada (+1473)
                        </option>
                        <option data-countryCode="GP" value="590">
                          Guadeloupe (+590)
                        </option>
                        <option data-countryCode="GU" value="671">
                          Guam (+671)
                        </option>
                        <option data-countryCode="GT" value="502">
                          Guatemala (+502)
                        </option>
                        <option data-countryCode="GN" value="224">
                          Guinea (+224)
                        </option>
                        <option data-countryCode="GW" value="245">
                          Guinea - Bissau (+245)
                        </option>
                        <option data-countryCode="GY" value="592">
                          Guyana (+592)
                        </option>
                        <option data-countryCode="HT" value="509">
                          Haiti (+509)
                        </option>
                        <option data-countryCode="HN" value="504">
                          Honduras (+504)
                        </option>
                        <option data-countryCode="HK" value="852">
                          Hong Kong (+852)
                        </option>
                        <option data-countryCode="HU" value="36">
                          Hungary (+36)
                        </option>
                        <option data-countryCode="IS" value="354">
                          Iceland (+354)
                        </option>
                        <option data-countryCode="IN" value="91">
                          India (+91)
                        </option>
                        <option data-countryCode="ID" value="62">
                          Indonesia (+62)
                        </option>
                        <option data-countryCode="IR" value="98">
                          Iran (+98)
                        </option>
                        <option data-countryCode="IQ" value="964">
                          Iraq (+964)
                        </option>
                        <option data-countryCode="IE" value="353">
                          Ireland (+353)
                        </option>
                        <option data-countryCode="IL" value="972">
                          Israel (+972)
                        </option>
                        <option data-countryCode="IT" value="39">
                          Italy (+39)
                        </option>
                        <option data-countryCode="JM" value="1876">
                          Jamaica (+1876)
                        </option>
                        <option data-countryCode="JP" value="81">
                          Japan (+81)
                        </option>
                        <option data-countryCode="JO" value="962">
                          Jordan (+962)
                        </option>
                        <option data-countryCode="KZ" value="7">
                          Kazakhstan (+7)
                        </option>
                        <option data-countryCode="KE" value="254">
                          Kenya (+254)
                        </option>
                        <option data-countryCode="KI" value="686">
                          Kiribati (+686)
                        </option>
                        <option data-countryCode="KP" value="850">
                          Korea North (+850)
                        </option>
                        <option data-countryCode="KR" value="82">
                          Korea South (+82)
                        </option>
                        <option data-countryCode="KW" value="965">
                          Kuwait (+965)
                        </option>
                        <option data-countryCode="KG" value="996">
                          Kyrgyzstan (+996)
                        </option>
                        <option data-countryCode="LA" value="856">
                          Laos (+856)
                        </option>
                        <option data-countryCode="LV" value="371">
                          Latvia (+371)
                        </option>
                        <option data-countryCode="LB" value="961">
                          Lebanon (+961)
                        </option>
                        <option data-countryCode="LS" value="266">
                          Lesotho (+266)
                        </option>
                        <option data-countryCode="LR" value="231">
                          Liberia (+231)
                        </option>
                        <option data-countryCode="LY" value="218">
                          Libya (+218)
                        </option>
                        <option data-countryCode="LI" value="417">
                          Liechtenstein (+417)
                        </option>
                        <option data-countryCode="LT" value="370">
                          Lithuania (+370)
                        </option>
                        <option data-countryCode="LU" value="352">
                          Luxembourg (+352)
                        </option>
                        <option data-countryCode="MO" value="853">
                          Macao (+853)
                        </option>
                        <option data-countryCode="MK" value="389">
                          Macedonia (+389)
                        </option>
                        <option data-countryCode="MG" value="261">
                          Madagascar (+261)
                        </option>
                        <option data-countryCode="MW" value="265">
                          Malawi (+265)
                        </option>
                        <option data-countryCode="MY" value="60">
                          Malaysia (+60)
                        </option>
                        <option data-countryCode="MV" value="960">
                          Maldives (+960)
                        </option>
                        <option data-countryCode="ML" value="223">
                          Mali (+223)
                        </option>
                        <option data-countryCode="MT" value="356">
                          Malta (+356)
                        </option>
                        <option data-countryCode="MH" value="692">
                          Marshall Islands (+692)
                        </option>
                        <option data-countryCode="MQ" value="596">
                          Martinique (+596)
                        </option>
                        <option data-countryCode="MR" value="222">
                          Mauritania (+222)
                        </option>
                        <option data-countryCode="YT" value="269">
                          Mayotte (+269)
                        </option>
                        <option data-countryCode="MX" value="52">
                          Mexico (+52)
                        </option>
                        <option data-countryCode="FM" value="691">
                          Micronesia (+691)
                        </option>
                        <option data-countryCode="MD" value="373">
                          Moldova (+373)
                        </option>
                        <option data-countryCode="MC" value="377">
                          Monaco (+377)
                        </option>
                        <option data-countryCode="MN" value="976">
                          Mongolia (+976)
                        </option>
                        <option data-countryCode="MS" value="1664">
                          Montserrat (+1664)
                        </option>
                        <option data-countryCode="MA" value="212">
                          Morocco (+212)
                        </option>
                        <option data-countryCode="MZ" value="258">
                          Mozambique (+258)
                        </option>
                        <option data-countryCode="MN" value="95">
                          Myanmar (+95)
                        </option>
                        <option data-countryCode="NA" value="264">
                          Namibia (+264)
                        </option>
                        <option data-countryCode="NR" value="674">
                          Nauru (+674)
                        </option>
                        <option data-countryCode="NP" value="977">
                          Nepal (+977)
                        </option>
                        <option data-countryCode="NL" value="31">
                          Netherlands (+31)
                        </option>
                        <option data-countryCode="NC" value="687">
                          New Caledonia (+687)
                        </option>
                        <option data-countryCode="NZ" value="64">
                          New Zealand (+64)
                        </option>
                        <option data-countryCode="NI" value="505">
                          Nicaragua (+505)
                        </option>
                        <option data-countryCode="NE" value="227">
                          Niger (+227)
                        </option>
                        <option data-countryCode="NG" value="234">
                          Nigeria (+234)
                        </option>
                        <option data-countryCode="NU" value="683">
                          Niue (+683)
                        </option>
                        <option data-countryCode="NF" value="672">
                          Norfolk Islands (+672)
                        </option>
                        <option data-countryCode="NP" value="670">
                          Northern Marianas (+670)
                        </option>
                        <option data-countryCode="GB" value="44" Selected>
                          Norway (+47)
                        </option>
                        <option data-countryCode="US" value="1">
                          UK (+44)
                        </option>
                        <option data-countryCode="NO" value="47">
                          Norway (+47)
                        </option>
                        <option data-countryCode="OM" value="968">
                          Oman (+968)
                        </option>
                        <option data-countryCode="PW" value="680">
                          Palau (+680)
                        </option>
                        <option data-countryCode="PA" value="507">
                          Panama (+507)
                        </option>
                        <option data-countryCode="PG" value="675">
                          Papua New Guinea (+675)
                        </option>
                        <option data-countryCode="PY" value="595">
                          Paraguay (+595)
                        </option>
                        <option data-countryCode="PE" value="51">
                          Peru (+51)
                        </option>
                        <option data-countryCode="PH" value="63">
                          Philippines (+63)
                        </option>
                        <option data-countryCode="PL" value="48">
                          Poland (+48)
                        </option>
                        <option data-countryCode="PT" value="351">
                          Portugal (+351)
                        </option>
                        <option data-countryCode="PR" value="1787">
                          Puerto Rico (+1787)
                        </option>
                        <option data-countryCode="QA" value="974">
                          Qatar (+974)
                        </option>
                        <option data-countryCode="RE" value="262">
                          Reunion (+262)
                        </option>
                        <option data-countryCode="RO" value="40">
                          Romania (+40)
                        </option>
                        <option data-countryCode="RU" value="7">
                          Russia (+7)
                        </option>
                        <option data-countryCode="RW" value="250">
                          Rwanda (+250)
                        </option>
                        <option data-countryCode="SM" value="378">
                          San Marino (+378)
                        </option>
                        <option data-countryCode="ST" value="239">
                          Sao Tome &amp; Principe (+239)
                        </option>
                        <option data-countryCode="SA" value="966">
                          Saudi Arabia (+966)
                        </option>
                        <option data-countryCode="SN" value="221">
                          Senegal (+221)
                        </option>
                        <option data-countryCode="CS" value="381">
                          Serbia (+381)
                        </option>
                        <option data-countryCode="SC" value="248">
                          Seychelles (+248)
                        </option>
                        <option data-countryCode="SL" value="232">
                          Sierra Leone (+232)
                        </option>
                        <option data-countryCode="SG" value="65">
                          Singapore (+65)
                        </option>
                        <option data-countryCode="SK" value="421">
                          Slovak Republic (+421)
                        </option>
                        <option data-countryCode="SI" value="386">
                          Slovenia (+386)
                        </option>
                        <option data-countryCode="SB" value="677">
                          Solomon Islands (+677)
                        </option>
                        <option data-countryCode="SO" value="252">
                          Somalia (+252)
                        </option>
                        <option data-countryCode="ZA" value="27">
                          South Africa (+27)
                        </option>
                        <option data-countryCode="ES" value="34">
                          Spain (+34)
                        </option>
                        <option data-countryCode="LK" value="94">
                          Sri Lanka (+94)
                        </option>
                        <option data-countryCode="SH" value="290">
                          St. Helena (+290)
                        </option>
                        <option data-countryCode="KN" value="1869">
                          St. Kitts (+1869)
                        </option>
                        <option data-countryCode="SC" value="1758">
                          St. Lucia (+1758)
                        </option>
                        <option data-countryCode="SD" value="249">
                          Sudan (+249)
                        </option>
                        <option data-countryCode="SR" value="597">
                          Suriname (+597)
                        </option>
                        <option data-countryCode="SZ" value="268">
                          Swaziland (+268)
                        </option>
                        <option data-countryCode="SE" value="46">
                          Sweden (+46)
                        </option>
                        <option data-countryCode="CH" value="41">
                          Switzerland (+41)
                        </option>
                        <option data-countryCode="SI" value="963">
                          Syria (+963)
                        </option>
                        <option data-countryCode="TW" value="886">
                          Taiwan (+886)
                        </option>
                        <option data-countryCode="TJ" value="7">
                          Tajikstan (+7)
                        </option>
                        <option data-countryCode="TH" value="66">
                          Thailand (+66)
                        </option>
                        <option data-countryCode="TG" value="228">
                          Togo (+228)
                        </option>
                        <option data-countryCode="TO" value="676">
                          Tonga (+676)
                        </option>
                        <option data-countryCode="TT" value="1868">
                          Trinidad &amp; Tobago (+1868)
                        </option>
                        <option data-countryCode="TN" value="216">
                          Tunisia (+216)
                        </option>
                        <option data-countryCode="TR" value="90">
                          Turkey (+90)
                        </option>
                        <option data-countryCode="TM" value="7">
                          Turkmenistan (+7)
                        </option>
                        <option data-countryCode="TM" value="993">
                          Turkmenistan (+993)
                        </option>
                        <option data-countryCode="TC" value="1649">
                          Turks &amp; Caicos Islands (+1649)
                        </option>
                        <option data-countryCode="TV" value="688">
                          Tuvalu (+688)
                        </option>
                        <option data-countryCode="UG" value="256">
                          Uganda (+256)
                        </option>
                        <option data-countryCode="GB" value="44">
                          UK (+44)
                        </option>
                        <option data-countryCode="UA" value="380">
                          Ukraine (+380)
                        </option>
                        <option data-countryCode="AE" value="971">
                          United Arab Emirates (+971)
                        </option>
                        <option data-countryCode="UY" value="598">
                          Uruguay (+598)
                        </option>
                        <option data-countryCode="US" value="1">
                          USA (+1)
                        </option>
                        <option data-countryCode="UZ" value="7">
                          Uzbekistan (+7)
                        </option>
                        <option data-countryCode="VU" value="678">
                          Vanuatu (+678)
                        </option>
                        <option data-countryCode="VA" value="379">
                          Vatican City (+379)
                        </option>
                        <option data-countryCode="VE" value="58">
                          Venezuela (+58)
                        </option>
                        <option data-countryCode="VN" value="84">
                          Vietnam (+84)
                        </option>
                        <option data-countryCode="VG" value="84">
                          Virgin Islands - British (+1284)
                        </option>
                        <option data-countryCode="VI" value="84">
                          Virgin Islands - US (+1340)
                        </option>
                        <option data-countryCode="WF" value="681">
                          Wallis &amp; Futuna (+681)
                        </option>
                        <option data-countryCode="YE" value="969">
                          Yemen (North)(+969)
                        </option>
                        <option data-countryCode="YE" value="967">
                          Yemen (South)(+967)
                        </option>
                        <option data-countryCode="ZM" value="260">
                          Zambia (+260)
                        </option>
                        <option data-countryCode="ZW" value="263">
                          Zimbabwe (+263)
                        </option>
                      </optgroup>
                    </select>
                    {errors.country_code && (
                      <small className="errorText mx-1 ">
                        {errors.country_code?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-3 mb-4">
                    <label htmlFor="">Serviceable City</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={cities}
                      className="basic-multi-select z-3 "
                      classNamePrefix="select"
                      onChange={handleChange}
                      value={selectedCities}
                    />
                    {errors.service_radius && (
                      <small className="errorText mx-1 ">
                        {errors.service_radius?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-3 mb-4">
                    <label htmlFor="">Commission (%)</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.commission,
                      })}
                      name="commission"
                      onInput={(e) => {
                        if (e.target.value > 100) {
                          alert("Enter value upto 100");
                          e.target.value = 100;
                        }
                      }}
                      id="name"
                      {...register("commission", {
                        maxLength: {
                          value: 3,
                          message: "Maximium 3 Characters!",
                        },
                      })}
                    />
                    {errors.commission && (
                      <small className="errorText mx-1 ">
                        {errors.commission?.message}
                      </small>
                    )}
                  </div>

                  <br className="border" />
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">BANK NAME (optional)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.bank_name,
                      })}
                      name="bank_name"
                      id="name"
                      {...register("bank_name", {
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "Maximium 20 Characters!",
                        },
                      })}
                    />
                    {errors.bank_name && (
                      <small className="errorText mx-1 ">
                        {errors.bank_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Account Number(optional)</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.bank_account,
                      })}
                      name="bank_account"
                      id="name"
                      {...register("bank_account", {
                        minLength: {
                          value: 8,
                          message: "Minimium 8 Characters!",
                        },
                        maxLength: {
                          value: 25,
                          message: "Maximium 25 Characters!",
                        },
                      })}
                    />
                    {errors.bank_account && (
                      <small className="errorText mx-1 ">
                        {errors.bank_account?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Account Holder Name (optional)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.account_holder,
                      })}
                      name="account_holder"
                      id="name"
                      {...register("account_holder", {
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "Maximium 20 Characters!",
                        },
                      })}
                    />
                    {errors.account_holder && (
                      <small className="errorText mx-1 ">
                        {errors.account_holder?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div
                      className={
                        errors.trade_licence_copy
                          ? "row view-inner-box border mx-0 w-100 border border-danger"
                          : "row view-inner-box border mx-0 w-100"
                      }
                    >
                      <span>Trade Licence Copy:</span>
                      <div className="col img_box_show">
                        {errors.trade_licence_copy && (
                          <small className="errorText mx-1 ">
                            {errors.trade_licence_copy?.message}
                          </small>
                        )}
                        <input
                          className="d-none"
                          type="file"
                          id="file1"
                          name="trade_licence_copy"
                          {...register("trade_licence_copy", {
                            required: "*Licence is Required!",
                          })}
                          onChange={(e) =>
                            onFileSelection(e, "trade_licence_copy")
                          }
                        />

                        <label htmlFor="file1">
                          <div className="">
                            {files.trade_licence_copy ? (
                              <p>
                                <i class="fa-solid fa-square-check" />
                                {files.trade_licence_copy?.name}
                              </p>
                            ) : (
                              <p>
                                <i className="fa fa-upload" /> Upload File
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div
                      className={
                        errors.signed_contract
                          ? "row view-inner-box border mx-0 w-100 border border-danger"
                          : "row view-inner-box border mx-0 w-100"
                      }
                    >
                      <span>Signed Contract:</span>
                      <div className="col img_box_show">
                        {errors.signed_contract && (
                          <small className="errorText mx-1 ">
                            {errors.signed_contract?.message}
                          </small>
                        )}
                        <input
                          className="d-none"
                          type="file"
                          id="file2"
                          name="signed_contract"
                          {...register("signed_contract", {
                            required: "*Licence is Required!",
                          })}
                          onChange={(e) =>
                            onFileSelection(e, "signed_contract")
                          }
                        />
                        <label htmlFor="file2">
                          <div className="">
                            {files.signed_contract ? (
                              <p>
                                <i class="fa-solid fa-square-check" />
                                {files.signed_contract?.name}
                              </p>
                            ) : (
                              <p>
                                <i className="fa fa-upload" /> Upload File
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <Button
                      loading={loader}
                      appearance="primary"
                      className="comman_btn2"
                      type="submit"
                    >
                      Save
                    </Button>
                    <Loader />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
