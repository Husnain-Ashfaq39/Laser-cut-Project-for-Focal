import { useEffect, useState } from 'react';
import { Button } from '@/components/_ui/button';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { Link, useNavigate } from 'react-router-dom';
import editsvg from '@/assets/icons/edit.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
// import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { fetchUserByEmail } from '@/services/db-services';  // Import your Firestore fetch function

function ProfileDetails() {
    const user = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userData, setUserData] = useState<any | null>(null); // State to store user data from Firestore

    // const storage = getStorage();
    // const db = getFirestore();

    // Fetch the user from Firestore using email
    const fetchUserProfile = async () => {
        try {
            const fetchedUser = await fetchUserByEmail('Users', user.email); // Fetch the user by email
            if (fetchedUser) {
                setUserData(fetchedUser);  // Set the fetched user data
                if (fetchedUser.profileImage) {
                    setProfilePic(fetchedUser.profileImage);  // Set profile picture if it exists
                }
            } else {
                console.error("User not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();  // Fetch user on component mount
    }, []);

    // Upload a new image and update Firestore
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && userData) {
            // const file = event.target.files[0];
            // const userId = userData.id; // Get user ID from Firestore data
            
            try {
                // // 1. Delete previous image if it exists
                // if (userData.profileImage) {
                //     const oldImageRef = ref(storage, `profile_images/${userId}`);
                //     await deleteObject(oldImageRef);
                // }

                // // 2. Upload the new image
                // const imageRef = ref(storage, `profile_images/${userId}`);
                // await uploadBytes(imageRef, file);

                // // 3. Get the image URL
                // const downloadURL = await getDownloadURL(imageRef);

                // // 4. Update Firestore with the new image URL
                // const userDocRef = doc(db, 'Users', userId);
                // await updateDoc(userDocRef, { profileImage: downloadURL });

                // // 5. Update local state to show the new profile picture
                // setProfilePic(downloadURL);
                // setUserData({ ...userData, profileImage: downloadURL }); // Update local user data with new profile image URL
                // console.log('Profile image updated successfully!');
            } catch (error) {
                console.error('Error updating profile image:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading profile...</div>; // Show a loading message while fetching data
    }

    return (
        <div className='w-full bg-slate-100 font-body'>
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
                <h1 className="text-center font-primary text-3xl">Profile</h1>
                <div className='my-3'>
                    <Link
                        to=""
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:underline"
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
                        <div className='m-3 p-3 space-y-8 w-full items-center'>
                            <div className='flex justify-between w-full'>
                                <div className='flex items-center space-x-3'>
                                    <div className="relative w-16 h-16">
                                        <img
                                            src={profilePic}
                                            alt="User Profile"
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border">
                                            <label htmlFor="file-input">
                                                <img src={editsvg} className='w-4 h-4 cursor-pointer' alt="Edit" />
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
                                    <div className='flex flex-col'>
                                        <div>{userData?.firstName} {userData?.lastName}</div>
                                        <div className='text-gray-400'>{userData?.email}</div>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="rounded-lg font-secondary"
                                    onClick={() => navigate("/quotes/history")}
                                >
                                    Delete
                                </Button>
                            </div>
                            <div className='flex justify-between w-full'>
                                <div>Name</div>
                                <div className='text-gray-500'>{userData?.firstName} {userData?.lastName}</div>
                            </div>
                            <div className="border-[0.05px] border-gray-200"></div>
                            <div className='flex justify-between w-full'>
                                <div>Email</div>
                                <div className='text-gray-500'>{userData?.email}</div>
                            </div>
                            <div className="border-[0.05px] border-gray-200"></div>
                            <div className='flex justify-between w-full'>
                                <div>Location</div>
                                <div className='text-gray-500'>Not found</div>
                            </div>
                            <div className="border-[0.05px] border-gray-200"></div>
                        </div>
                    </div>
                </section>
            </main>
            <FooterAdmin />
        </div>
    );
}

export default ProfileDetails;
