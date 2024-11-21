/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/_ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/_ui/dialog";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import DialogImage from "@/assets/dialogs-img.png";
import FocalLogo from "@/assets/focal-logo-2.png";
// Firestore imports
import { AddClient, AddContact, FetchClients } from "@/services/webflow-services";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateUserProfileField } from '@/services/db-services';
import { useNavigate } from 'react-router-dom';

// Toast imports
import { useToast } from "@/components/_ui/toast/use-toast";
import { ToastAction } from "@/components/_ui/toast/toast";

function CompanyDialog() {
    const user = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [company, setCompany] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [selectedClientID, setSelectedClientID] = useState<string>("");
    const [isCompanyAssociated, setIsCompanyAssociated] = useState<boolean | null>(null);
    const [companySuggestions, setCompanySuggestions] = useState<any[]>([]);
    const [showdatalist, setShowdatalist] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>(''); // New state for phone number
    const [isSaving, setIsSaving] = useState<boolean>(false); // New state for saving status
    const { toast } = useToast();

    useEffect(() => {
        if(user.contactID !== '') {
            navigate('/');
        }
        const fetchClientsData = async () => {
            const response: any = await FetchClients();
            if (response.success) {
                setClients(response.data);
            } else {
                console.error("Failed to fetch clients:", response.message);
            }
        };
        fetchClientsData();
    }, [navigate, user.contactID]);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setCompany(userInput);

        const trimmedInput = userInput.trim().toLowerCase();
        if (isCompanyAssociated && trimmedInput.length >= 1) {
            const filteredSuggestions = clients.filter((client) => {
                const clientName = Array.isArray(client.Name) ? client.Name[0] : client.Name;
                return clientName?.toLowerCase().includes(trimmedInput);
            }).slice(0, 3); // Limit to 3 suggestions
            setCompanySuggestions(filteredSuggestions);
            setShowdatalist(filteredSuggestions.length > 0);
        } else {
            setCompanySuggestions([]);
            setShowdatalist(false);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAddress(e.target.value);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosition(e.target.value);
    };

    const handleSave = async () => {
        setIsSaving(true); // Start saving
        try {
            if (isCompanyAssociated === null) {
                toast({
                    variant: "destructive",
                    title: "Company Association Required",
                    description: "Please indicate if you are associated with a company.",
                    duration: 5000,
                });
                return;
            }

            if (isCompanyAssociated && !selectedClientID) {
                toast({
                    title: "Selected company does not exist",
                    description:
                        "Please select a company exactly from the provided list.",
                    duration: 5000,
                });
                return;
            }

            // Additional validation for company name when not associated
            if (!isCompanyAssociated && !company.trim()) {
                toast({
                    variant: "destructive",
                    title: "Company name is required",
                    description: "Please enter your company name.",
                    duration: 5000,
                });
                return;
            }

            let clientID = '';
            let contactID;

            if (isCompanyAssociated) {
                const contact = {
                    address: selectedAddress || '',
                    clientUUID: selectedClientID || '',
                    email: user.email || '',
                    mobile: phoneNumber || '',
                    name: `${user.firstName} ${user.lastName}`,
                    phone: phoneNumber,
                    position: position || "Manager",
                };
                contactID = await AddContact(contact);
                await updateUserProfileField(user.id, "clientID", selectedClientID);
                await updateUserProfileField(user.id, "contactID", contactID);
            } else {
                const client = {
                    address: selectedAddress,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    name: company,
                };
                clientID = await AddClient(client);
                await updateUserProfileField(user.id, "clientID", clientID);

                const contact = {
                    address: selectedAddress || '',
                    clientUUID: clientID || '',
                    email: user.email || '',
                    mobile: phoneNumber || '',
                    name: `${user.firstName} ${user.lastName}`,
                    phone: phoneNumber,
                    position: position || "Manager",
                };
                console.log('this is contact data ', contact);
                console.log('this is contact data ', JSON.stringify(contact));

                contactID = await AddContact(contact);
                await updateUserProfileField(user.id, "contactID", contactID);
            }

            await updateUserProfileField(user.id, "address", selectedAddress);
            await updateUserProfileField(user.id, "company", company);
            await updateUserProfileField(user.id, "mobile", phoneNumber);
            await updateUserProfileField(user.id, "position", position);

            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
                duration: 5000,
            });

            if(user.role === 'admin') {
                navigate('/admin/quotes');
            } else {
                navigate('/quotes/history');
            }

        } catch (error: any) {
            const errorMessage = error.message;
            toast({
                variant: "destructive",
                title: errorMessage,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
                duration: 5000,
            });
        } finally {
            setIsSaving(false); // End saving
        }
    };

    function toggleDialog(open: boolean): void {
        // Implement the toggle functionality if needed
        // For now, you can leave it empty or remove it if not used
    }

    return (
        <Dialog open={true} onOpenChange={toggleDialog}>
            <DialogTrigger asChild>
                {/* You can pass a trigger button or element if needed */}
                <></>
            </DialogTrigger>
            <DialogContent className="m-0 h-[100vh] overflow-y-auto p-0 lg:max-h-[90vh]">
                <div className="flex w-full flex-col items-center md:flex-row">
                    <div className="bg-red relative hidden h-full w-full flex-shrink-0 md:w-1/2 lg:block">
                        <img
                            src={DialogImage}
                            className="h-[90vh] w-full object-cover brightness-75"
                            alt="Dialog"
                        />
                        <div className="absolute inset-0 flex flex-col space-y-16 pl-8 pt-6">
                            <img src={FocalLogo} className="left-0 top-0 m-5 w-[100px]" alt="Focal Logo" />
                            <p className="font-cinzel text-4xl font-bold leading-loose text-white md:text-7xl">
                                Craft
                                <br />
                                From
                                <br />
                                Heart
                            </p>
                        </div>
                    </div>
                    <div className="m-auto flex w-full flex-col px-12 py-5 md:w-1/2">
                        <h1 className="font-cinzel py-8 text-center text-2xl font-bold">
                        Complete your profile to proceed
                        </h1>

                        <div className="grid gap-2 mb-4">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                placeholder="Mobile Number"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2 mb-4">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="Address"
                                value={selectedAddress}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2 mb-4">
                            <Label>Are you associated with a Company?</Label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="companyAssociation"
                                        value="yes"
                                        checked={isCompanyAssociated === true}
                                        onChange={() => setIsCompanyAssociated(true)}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="companyAssociation"
                                        value="no"
                                        checked={isCompanyAssociated === false}
                                        onChange={() => setIsCompanyAssociated(false)}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {/* Conditionally render Company and Position fields */}
                        {isCompanyAssociated !== null && (
                            <>
                                <div className="grid gap-2 relative">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        placeholder="Company"
                                        value={company}
                                        onChange={handleCompanyChange}
                                        onFocus={() => {
                                            if (isCompanyAssociated && company.trim().length >= 1 && companySuggestions.length > 0) {
                                                setShowdatalist(true);
                                            }
                                        }}
                                        onBlur={() => setTimeout(() => setShowdatalist(false), 200)}
                                        className="focus:outline-none focus:ring focus:border-blue-500 mt-2 mb-4"
                                    />

                                    {showdatalist && companySuggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-auto w-full mt-16">
                                            {companySuggestions.map((suggestion, index) => {
                                                const suggestionName = Array.isArray(suggestion.Name)
                                                    ? suggestion.Name[0]
                                                    : suggestion.Name;

                                                return (
                                                    <li
                                                        key={index}
                                                        onMouseDown={() => {
                                                            setSelectedClientID(suggestion.UUID[0]);
                                                            setCompany(suggestion.Name[0]);
                                                            console.log("selected client id", suggestion.UUID[0]);
                                                            setShowdatalist(false); // Hide suggestions after selection
                                                        }}
                                                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                                                    >
                                                        {suggestionName}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                <div className="grid gap-2 mb-4">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        placeholder="Position"
                                        value={position}
                                        onChange={handlePositionChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="button"
                            className={`secondary w-full rounded-full px-4 py-2 font-light text-white bg-black hover:bg-gray-800 transition duration-200 ${
                                isSaving ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            onClick={handleSave}
                            disabled={isSaving} // Disable button while saving
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CompanyDialog;
