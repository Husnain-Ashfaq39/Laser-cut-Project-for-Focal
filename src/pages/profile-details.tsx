import { useEffect, useState } from 'react';
import { Button } from '@/components/_ui/button';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { Link, useNavigate } from 'react-router-dom';
import editsvg from '@/assets/icons/edit.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PreLoader from '@/components/pre-loader';
import { uploadProfileImage, deleteProfileImage } from '@/services/storage-services';
import { updateUserProfileImage } from '@/services/db-services';

function ProfileDetails() {
    const user = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState<string>("https://via.placeholder.com/150");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setProfilePic(user.profileImage || "https://via.placeholder.com/150");
        }
        setLoading(false);
    }, [user]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user?.id) {
            try {
                // Delete the old image if it exists
                if (user.profileImage) await deleteProfileImage(user.id);

                // Upload new image and get the download URL
                const downloadURL = await uploadProfileImage(user.id, file);

                // Update Firestore with the new image URL
                await updateUserProfileImage(user.id, downloadURL);
                setProfilePic(downloadURL);
            } catch (error) {
                console.error('Error updating profile image:', error);
            }
        }
    };

    if (loading) return <PreLoader />;

    return (
        <div className='w-full bg-slate-100 font-body'>
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
                <h1 className="text-center font-primary text-3xl">Profile</h1>
                <div className="inline-block my-3">
                    <Link
                        to=""
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-blue-600 hover:underline"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>

                <section className="w-full max-w-7xl rounded-lg border border-gray-300 bg-white p-6">
                    <div className="flex flex-col justify-between gap-10">
                        <div className='m-3 p-3 space-y-8 w-full items-center'>
                        <div className='flex flex-col md:flex-row md:justify-between w-full'>
    <div className='flex items-center space-x-3'>
        <div className="relative w-12 h-12 md:w-16 md:h-16">
            <img
                src={profilePic}
                alt="User Profile"
                className="rounded-full object-cover w-full h-full"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border">
                <label htmlFor="file-input">
                    <img src={editsvg} className='w-3 h-3 md:w-4 md:h-4 cursor-pointer' alt="Edit" />
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
            <div className='text-sm md:text-base'>{user.firstName} {user.lastName}</div>
            <div className='text-xs md:text-sm text-gray-400'>{user.email}</div>
        </div>
    </div>
    <Button
        variant="destructive"
        className="rounded-lg font-secondary text-sm md:text-base px-3 py-1 md:px-4 md:py-2 mt-5 lg:mt-0"
        onClick={() => navigate("/quotes/history")}
    >
        Delete
    </Button>
</div>


                            {/* Name */}
                            <div className='flex justify-between w-full'>
                                <div>Name</div>
                                <div className='text-gray-500'>{user.firstName} {user.lastName}</div>
                            </div>
                            <div className="border-[0.05px] border-gray-200"></div>

                            {/* Email */}
                            <div className='flex justify-between w-full'>
                                <div>Email</div>
                                <div className='text-gray-500'>{user.email}</div>
                            </div>
                            <div className="border-[0.05px] border-gray-200"></div>

                            {/* Location */}
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
