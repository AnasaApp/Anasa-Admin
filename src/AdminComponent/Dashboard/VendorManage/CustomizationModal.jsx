import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Checkbox, message, Divider, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { UpdateServices } from "../../httpServices/dashHttpService";

const defaultCustomization = {
  status: true,
  maxSelection: 1,
  isRequired: false,
  customized_option_title_ar: "",
  customized_option_title_en: "",
  options: [
    {
      title_en: "",
      title_ar: "",
      choices: [],
    },
  ],
};

const CustomizationModal = ({ visible, onClose, onSave, initialData }) => {
  const [customizations, setCustomizations] = useState([defaultCustomization]);
  const [allEnabled, setAllEnabled] = useState(true);

  useEffect(() => {
    setAllEnabled(initialData?.customization);
    if (initialData?.packages?.length) {
      const cloned = initialData?.packages?.map((pkg) => ({
        ...pkg,
        options: pkg?.options?.map((opt) => ({ ...opt })),
      }));
      setCustomizations(cloned);
    } else {
      setCustomizations([defaultCustomization]);
    }
  }, [initialData]);

  console.log({ initialData });

  const handlePackageChange = (index, field, value) => {
    const updated = [...customizations];
    updated[index][field] = value;
    setCustomizations(updated);
  };

  const handleOptionChange = (pkgIndex, optIndex, field, value) => {
    const updated = [...customizations];
    updated[pkgIndex].options[optIndex][field] = value;
    setCustomizations(updated);
  };

  const addCustomization = () => {
    setCustomizations([...customizations, { ...defaultCustomization }]);
  };
  console.log(customizations);

  const addOption = (pkgIndex) => {
    const updated = [...customizations];
    updated[pkgIndex].options.push({ title_en: "", title_ar: "", choices: [] });
    setCustomizations(updated);
  };

  const removeCustomization = (index) => {
    const updated = [...customizations];
    updated.splice(index, 1);
    setCustomizations(updated.length ? updated : [defaultCustomization]);
  };

  const removeOption = (pkgIndex, optIndex) => {
    const updated = [...customizations];
    updated[pkgIndex].options.splice(optIndex, 1);
    if (updated[pkgIndex].options.length === 0) {
      updated[pkgIndex].options.push({
        title_en: "",
        title_ar: "",
        choices: [],
      });
    }
    setCustomizations(updated);
  };

  const toggleAllStatus = (checked) => {
    setAllEnabled(checked);
  };
  console.log({ customizations });

  const handleSave = async () => {
    let formData = new FormData();
    formData.append("customization", allEnabled);
    allEnabled && formData.append("packages", JSON.stringify(customizations));

    try {
      const { data, error } = await UpdateServices(initialData?.item?._id || initialData?._id, formData);
      if (!error && data?.results) {
        onClose();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    onSave({ packages: customizations });
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      title="Customization Options"
      width={850}
      okButtonProps={{
        className: "rounded-full",
        style: { background: "#E25829", borderColor: "#E25829" },
      }}
      cancelButtonProps={{ className: "rounded-full" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Customization Groups</h3>
        <Checkbox
          checked={allEnabled}
          onChange={(e) => toggleAllStatus(e.target.checked)}
        >
          Enable All
        </Checkbox>
      </div>

      {allEnabled && (
        <div className="space-y-6">
          {customizations?.map((pkg, pkgIndex) => (
            <div
              key={pkgIndex}
              className="p-4 border rounded-lg bg-gray-50 space-y-4 shadow-sm gap-2"
            >
              <div className="flex flex-wrap gap-2 items-center">
                <Input
                  placeholder="Title EN"
                  value={pkg.customized_option_title_en}
                  onChange={(e) =>
                    handlePackageChange(
                      pkgIndex,
                      "customized_option_title_en",
                      e.target.value
                    )
                  }
                  style={{ width: 200 }}
                />
                <Input
                  placeholder="Title AR"
                  value={pkg.customized_option_title_ar}
                  className="mx-2"
                  onChange={(e) =>
                    handlePackageChange(
                      pkgIndex,
                      "customized_option_title_ar",
                      e.target.value
                    )
                  }
                  style={{ width: 200 }}
                />
                <Input
                  placeholder="Max Selection"
                  type="number"
                  min={1}
                  value={pkg.option_select_count}
                  onChange={(e) =>
                    handlePackageChange(
                      pkgIndex,
                      "option_select_count",
                      parseInt(e.target.value)
                    )
                  }
                  style={{ width: 150 }}
                />
                <Checkbox
                  checked={pkg.is_required}
                  className="mx-2"
                  onChange={(e) =>
                    handlePackageChange(
                      pkgIndex,
                      "is_required",
                      e.target.checked
                    )
                  }
                >
                  Required
                </Checkbox>

                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeCustomization(pkgIndex)}
                  className="rounded-full"
                />
              </div>

              <Divider>Options</Divider>

              <div className="space-y-3">
                {pkg?.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-3 items-center">
                    <Input
                      placeholder="Option Title EN"
                      value={opt.option_en}
                      className="mb-2"
                      onChange={(e) =>
                        handleOptionChange(
                          pkgIndex,
                          optIndex,
                          "option_en",
                          e.target.value
                        )
                      }
                      style={{ width: 250 }}
                    />
                    <Input
                      placeholder="Option Title AR"
                      className="mx-2 mb-2"
                      value={opt.option_ar}
                      onChange={(e) =>
                        handleOptionChange(
                          pkgIndex,
                          optIndex,
                          "option_ar",
                          e.target.value
                        )
                      }
                      style={{ width: 250 }}
                    />
                    <Input
                      placeholder="Option Price"
                      className="mb-2"
                      value={opt.price}
                      onChange={(e) =>
                        handleOptionChange(
                          pkgIndex,
                          optIndex,
                          "price",
                          e.target.value
                        )
                      }
                      style={{ width: 200 }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeOption(pkgIndex, optIndex)}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>

              <Button
                type="dashed"
                onClick={() => addOption(pkgIndex)}
                icon={<PlusOutlined />}
                className="w-full rounded-full"
              >
                Add Option
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="primary"
        onClick={addCustomization}
        icon={<PlusOutlined />}
        block
        className="rounded-full mt-3"
        style={{ backgroundColor: "#4f73af", borderColor: "#4f73af" }}
      >
        Add Customization
      </Button>
    </Modal>
  );
};

export default CustomizationModal;
