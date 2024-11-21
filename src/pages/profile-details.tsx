import { useEffect, useState } from "react";
import { Button } from "@/components/_ui/button";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { Link, useNavigate } from "react-router-dom";
import editsvg from "@/assets/icons/edit.svg";
import edit2svg from "@/assets/icons/edit2.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PreLoader from "@/components/pre-loader";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "@/services/storage-services";
import verifiedsvg from "@/assets/icons/verified.svg";
import { toast } from "@/components/_ui/toast/use-toast";
import { deleteUser } from "@/services/auth";
import { updateUserProfileField } from "@/services/db-services";
import ConfirmationDialog from "@/components/_ui/confirmation";
import { getAuth, signOut } from "firebase/auth";
import { clearUser } from "@/redux/slices/auth-slice";

function ProfileDetails() {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const auth = getAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string>("/profile.jpg");
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editableFields, setEditableFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "Not Found",
    address: "", // Add address field
  });

  const [isEditing, setIsEditing] = useState(false); // Track whether fields are being edited
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion status

  useEffect(() => {
    if (user) {
      setProfilePic(user.profileImage || "/profile.jpg");
      setEditableFields({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        company: user.company || "Not Found",
        address: user.address || "", // Initialize address
      });
    }
    setLoading(false);
  }, [user]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      try {
        toast({
          title: "Profile Picture",
          description: "Your profile picture is being uploaded, please wait!",
          duration: 5000,
        });
        if (user.profileImage) await deleteProfileImage(user.id);
        const downloadURL = await uploadProfileImage(user.id, file);
        await updateUserProfileField(user.id, "profileImage", downloadURL);
        setProfilePic(downloadURL);
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast({
          title: "Error",
          description: "Failed to upload profile picture.",
          duration: 5000,
        });
      }
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditableFields({ ...editableFields, [field]: value });
  };

  const saveFieldUpdates = async () => {
    try {
      await updateUserProfileField(
        user.id,
        "firstName",
        editableFields.firstName,
      );
      await updateUserProfileField(
        user.id,
        "lastName",
        editableFields.lastName,
      );
      await updateUserProfileField(user.id, "company", editableFields.company);
      await updateUserProfileField(user.id, "address", editableFields.address); // Save address

      toast({
        title: "Profile Updated",
        description: "Your profile details have been updated successfully.",
        duration: 5000,
      });
      setIsEditing(false); // Set back to view mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        duration: 5000,
      });
    }
  };

  const handleRequestCredit = async () => {
    if (user.creditAccount === "request") {
      toast({
        title: "Already Requested",
        description: "You have already requested for Credit Account",
        duration: 5000,
      });
    } else {
      try {
        await updateUserProfileField(user.id, "creditAccount", "request");
        toast({
          title: "Request for Credit Account",
          description: "Request has been sent for Credit Account",
          duration: 5000,
        });
      } catch (error) {
        console.error("Error requesting credit account:", error);
        toast({
          title: "Error",
          description: "Failed to request credit account.",
          duration: 5000,
        });
      }
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true); // Start deletion process
    try {
      await deleteUser(user.email);
      await signOut(auth);
      dispatch(clearUser());
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        duration: 5000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete your account.",
        duration: 5000,
      });
      setIsDeleting(false); // Revert deletion status on error
    }
  };

  if (loading || !user) return <PreLoader />;

  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">Profile</h1>
        <div className="my-3 inline-block">
          <Link
            to=""
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        </div>

        <section className="w-full max-w-7xl rounded-lg border border-gray-300 bg-white p-6">
          <div className="flex flex-col justify-between gap-10">
            <div className="m-3 w-full items-center space-y-8 p-3">
              <div className="flex w-full flex-col md:flex-row md:justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 rounded-full border-2 border-gray-300 object-cover md:h-16 md:w-16">
                    <img
                      src={profilePic}
                      alt="User Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 rounded-full border bg-white p-1 shadow-md">
                      <label htmlFor="file-input">
                        <img
                          src={editsvg}
                          className="h-3 w-3 cursor-pointer md:h-4 md:w-4"
                          alt="Edit"
                        />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex space-x-1 text-sm md:text-base">
                      {editableFields.firstName} {editableFields.lastName}
                      {user.creditAccount === "verified" && (
                        <img src={verifiedsvg} alt="Verified" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 md:text-sm">
                      {editableFields.email}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {user.creditAccount !== "verified" && (
                    <Button
                      variant="default"
                      className="mt-5 rounded-lg px-3 py-1 font-body text-sm md:px-4 md:py-2 md:text-base lg:mt-0"
                      onClick={handleRequestCredit}
                      disabled={isDeleting} // Optional: Disable if deleting
                    >
                      Request for Credit Account
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className={`mt-5 rounded-lg px-3 py-1 font-body text-sm md:px-4 md:py-2 md:text-base lg:mt-0 ${isDeleting ? "bg-red-500 cursor-not-allowed" : ""
                      }`}
                    onClick={handleDeleteClick}
                    disabled={isDeleting} // Disable button when deleting
                  >
                    {isDeleting ? "Deleting..." : "Delete My Account"}
                  </Button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-6">
                <div className="flex w-full justify-between">
                  <label htmlFor="firstName" className="font-semibold">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="firstName"
                      value={editableFields.firstName}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                      onChange={(e) =>
                        handleFieldChange("firstName", e.target.value)
                      }
                    />
                  ) : (
                    <span className="text-gray-500">
                      {editableFields.firstName}
                    </span>
                  )}
                </div>

                <div className="border-[0.05px] border-gray-200"></div>

                <div className="flex w-full justify-between">
                  <label htmlFor="lastName" className="font-semibold">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="lastName"
                      value={editableFields.lastName}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                      onChange={(e) =>
                        handleFieldChange("lastName", e.target.value)
                      }
                    />
                  ) : (
                    <span className="text-gray-500">
                      {editableFields.lastName}
                    </span>
                  )}
                </div>

                <div className="border-[0.05px] border-gray-200"></div>

                <div className="flex w-full justify-between">
                  <label htmlFor="email" className="font-semibold">
                    Email
                  </label>
                  <span className="text-gray-500">{editableFields.email}</span>
                </div>

                <div className="border-[0.05px] border-gray-200"></div>

                <div className="flex w-full justify-between">
                  <label htmlFor="company" className="font-semibold">
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="company"
                      value={editableFields.company}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                      onChange={(e) =>
                        handleFieldChange("company", e.target.value)
                      }
                    />
                  ) : (
                    <span className="text-gray-500">
                      {editableFields.company}
                    </span>
                  )}
                </div>

                <div className="border-[0.05px] border-gray-200"></div>

                {/* New Address Field */}
                <div className="flex w-full justify-between">
                  <label htmlFor="address" className="font-semibold">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="address"
                      value={editableFields.address}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                      onChange={(e) =>
                        handleFieldChange("address", e.target.value)
                      }
                    />
                  ) : (
                    <span className="text-gray-500">
                      {editableFields.address}
                    </span>
                  )}
                </div>
              </div>

              {/* Button to switch between edit and save modes */}
              <Button
                variant="default"
                className="mt-5"
                onClick={() => {
                  if (isEditing) saveFieldUpdates(); // Save changes if already in edit mode
                  setIsEditing(!isEditing); // Toggle edit mode
                }}
              >
                {isEditing ? (
                  "Save Changes"
                ) : (
                  <img src={edit2svg} alt="Edit" className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterAdmin />
      <ConfirmationDialog
        open={openConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
}

export default ProfileDetails;
