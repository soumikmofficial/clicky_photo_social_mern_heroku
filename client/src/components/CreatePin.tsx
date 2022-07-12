import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectUser } from "../store";
import { useCreatePinMutation } from "../hooks/pinHooks";
import { Puff } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

interface IFormValues {
  image: any;
  title: string;
  about: string;
  category: string;
}

const validationSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("an image is required")
    .test("fileSize", "The file is too large", (value) => {
      if (!value) return true; // attachment is optional
      return value.size <= 5000000;
    })
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) =>
        value &&
        [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/svg",
          "image/gif",
        ].includes(value.type)
    ),
  title: yup.string().required("a title is required"),
  about: yup
    .string()
    .required("description is required")
    .max(150, "must be less than 150 chars"),
  category: yup.string().required("must provide a category").max(25),
});

const initialValues: IFormValues = {
  image: "",
  title: "",
  about: "",
  category: "",
};

const CreatePin = () => {
  // todo: states
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { mutateAsync, isLoading, error, isSuccess } = useCreatePinMutation();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // todo: functions
  const onSubmit = async (values: IFormValues, submitProps: any) => {
    if (user) {
      const data = { ...values };
      mutateAsync(data);
      submitProps.setSubmitting(false);
      submitProps.resetForm();
    }
    setImagePreview(null);
  };

  // todo: useEffects
  useEffect(() => {
    error && setMessage(error.response.data.message);
    setTimeout(() => setMessage(""), 5000);
  }, [isLoading, error]);

  useEffect(() => {
    isSuccess && navigate("/");
  }, [isSuccess, isLoading, navigate]);

  // todo: return
  return (
    <div className="relative flex justify-center items-center w-full h-full  overflow-scroll">
      {isLoading ? (
        <div className="flex flex-col gap-2 text-gray-600 items-center">
          <Puff color="#eb7c74" height={80} width={80} />
          <p>Creating your Pin</p>
        </div>
      ) : (
        <div className="flex w-full lg:w-4/5 lg:h-4/5 h-full lg:min-w-[700px] p-2 bg-dark2 overflow-scroll">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form className="w-full flex flex-col lg:flex-row min-h-max">
                  {/* the image upload */}
                  <div className="bg-dark1 rounded-lg relative lg:flex-1 h-full lg:h-full flex items-center justify-center p-3 overflow-scroll shrink-0 mb-5">
                    {message ? (
                      <div
                        className={`animate-pop-in bg-red-200 h-full w-full flex items-center justify-center capitalize`}
                      >
                        {message}
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="image"
                          className="w-full rounded-lg h-full outline-none border-2 border-gray-200 border-dotted flex flex-col items-center justify-around px-3 text-center capitalize text-sm bg-dark1  cursor-pointer p-4"
                        >
                          <input
                            required
                            accept="image/png, image/jpg, image/jpeg, image/svg, image/gif"
                            type="file"
                            id="image"
                            name="image"
                            hidden
                            onChange={(e: any) => {
                              formik.setFieldValue("image", e.target.files[0]);
                              setImagePreview(
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {imagePreview ? (
                            <img
                              alt=""
                              src={imagePreview}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <>
                              <div className="flex flex-col gap-2 items-center">
                                <AiOutlineCloudUpload fontSize={20} />
                                <p>Click to upload image</p>
                              </div>
                              <p className="text-gray-600">
                                recommended to use high quality JPG, JPEG, SVG,
                                PNG or GIF less than 10Mb
                              </p>
                            </>
                          )}
                        </label>
                        <ErrorMessage
                          name="image"
                          className="bg-red-400 absolute px-2 py-1 animate-pop-in rounded-lg text-white"
                          component="div"
                        />
                      </>
                    )}
                  </div>
                  {/* the details */}
                  <div className="lg:flex-1 p-4 flex flex-col gap-3 ">
                    {/* title */}
                    <Field
                      required
                      name="title"
                      className="w-full px-2 py-2 outline-none placeholder:text-2xl placeholder:font-bold border-b-2 border-gray-300 font-bold text-2xl bg-dark2"
                      placeholder="Add a title"
                    />
                    <ErrorMessage
                      name="title"
                      className="bg-red-400 px-2 py-1 animate-pop-in  rounded-lg text-white"
                      component="div"
                    />
                    {/* user details */}
                    <div className="flex gap-2 items-center justify-start my-3">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.avatar}
                        alt=""
                      />
                      <p className="capitalize font-bold">{user?.name}</p>
                    </div>
                    {/* about */}
                    <Field
                      required
                      as="textarea"
                      name="about"
                      className="w-full px-2 py-2 h-20 outline-none placeholder:text-lg border-b-2 border-gray-300 bg-dark2"
                      placeholder="Tell everyone what your pin is about"
                      maxLength={150}
                    />
                    <ErrorMessage
                      name="about"
                      className="bg-red-400 px-2 py-1 animate-pop-in rounded-lg text-white"
                      component="div"
                    />
                    {/* category */}
                    <Field
                      required
                      name="category"
                      className="w-full px-2 py-2 outline-none placeholder:text-lg border-b-2 border-gray-300 bg-dark2"
                      placeholder="Category"
                      max={25}
                    />
                    <ErrorMessage
                      name="category"
                      className="bg-red-400 px-2 py-1 animate-pop-in rounded-lg text-white"
                      component="div"
                    />
                    <button
                      type="submit"
                      className={` text-white rounded-3xl w-max px-3 py-2 mt-5 ${
                        formik.isValid || formik.isSubmitting
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                      disabled={!formik.isValid}
                    >
                      Create Pin
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CreatePin;
