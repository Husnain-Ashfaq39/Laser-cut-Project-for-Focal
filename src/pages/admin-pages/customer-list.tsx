import { useEffect, useState } from 'react';
import { Search } from '@/components/_ui/search';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { DataTable } from '@/components/tables/data-table';
import { CustomerColumn } from '@/components/tables/customers-column';
import { fetchAllUsers } from '@/services/db-services'; // Import the service
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/_ui/dialog";
import { Button } from '@/components/_ui/button';
import { handleSignup } from '@/services/auth'; // Import handleSignup
import PreLoader from '@/components/pre-loader';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
    const [newCustomer, setNewCustomer] = useState({        // New customer state
        name: '',
        email: '',
        password: '',   // Add password field
    });
    const [isAdding, setIsAdding] = useState(false); // Loading state for customer addition

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersData = await fetchAllUsers(); // Fetch users from Firestore

                setCustomers(usersData); // Set the users in state
                setFilteredCustomers(usersData);
                setLoading(false);       // Stop loading
            } catch (error) {
                console.error('Error fetching customers:', error);
                setLoading(false);
            }
        };

        getUsers();
    }, []);  // Runs once when component mounts

    // Function to filter customers based on search query
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase(); // Case insensitive search
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedQuery) // Partial matching
        );
        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);  // Runs whenever searchQuery or customers changes

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    // Handle form input changes for new customer
    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    // Handle new customer submission
    const handleAddCustomer = async () => {
        setIsAdding(true); // Set loading to true during submission
        try {
            // Call the handleSignup function to register the new user in Firebase
            await handleSignup(newCustomer.name, newCustomer.email, newCustomer.password);

            // If successful, update the customer list in the state
            const updatedCustomers = [...customers, newCustomer];
            setCustomers(updatedCustomers);
            setFilteredCustomers(updatedCustomers);  // Also update filtered list
            setIsModalOpen(false);  // Close modal after adding
        } catch (error) {
            console.error('Error adding customer:', error);
        } finally {
            setIsAdding(false); // Reset loading state after submission
        }
    };

    return (
        <>
            {loading ? (

                <PreLoader />

            ) : (
                <div className='w-full bg-slate-100'>
                    <NavbarAdmin />
                    <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
                        <h1 className="text-center font-primary text-3xl">
                            Customers
                        </h1>
                        <div className='flex justify-end space-x-3 items-center font-secondary mb-2'>
                            <button
                                className="rounded-full bg-black px-5 text-white h-8"
                                onClick={handleModalOpen}  // Open modal on button click
                                disabled={isAdding} // Disable button while adding
                            >
                                {isAdding ? 'Adding...' : '+ Add new user'}
                            </button>
                            {/* Search Input */}
                            <Search
                                type="text"
                                className="font-body font-medium w-40 rounded-full"
                                placeholder='Search user'
                                value={searchQuery} // Bind input value to state
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                            />
                        </div>
                        <DataTable data={filteredCustomers} columns={CustomerColumn} />
                    </main>
                    <FooterAdmin />
                </div>
            )}
            {/* Modal for adding new customer */}
            <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
                <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg transform transition-all sm:w-full sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Add New Customer</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Enter details for the new customer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Customer Name"
                            value={newCustomer.name}
                            onChange={handleNewCustomerChange}
                            className="w-full p-2 border rounded-full"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Customer Email"
                            value={newCustomer.email}
                            onChange={handleNewCustomerChange}
                            className="w-full p-2 border rounded-full"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Customer Password"
                            value={newCustomer.password}
                            onChange={handleNewCustomerChange}
                            className="w-full p-2 border rounded-full"
                        />
                        <div className="flex justify-end mt-4 space-x-2 font-secondary">
                            <Button variant="default" onClick={handleAddCustomer} disabled={isAdding}>
                                {isAdding ? 'Adding...' : 'Add Customer'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}

export default CustomerList;
