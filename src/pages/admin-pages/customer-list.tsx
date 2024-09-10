import { useEffect, useState } from 'react';
import { Search } from '@/components/_ui/search';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { DataTable } from '@/components/tables/data-table';
import { CustomerColumn } from '@/components/tables/customers-column';
import { fetchAllUsers } from '@/services/db-services'; 
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/_ui/dialog";
import { Button } from '@/components/_ui/button';
import { handleSignup } from '@/services/auth'; 
import PreLoader from '@/components/pre-loader';

function CustomerList() { 
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [showCreditRequests, setShowCreditRequests] = useState(false); // New state

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersData = await fetchAllUsers(); 
                setCustomers(usersData);
                setFilteredCustomers(usersData);
                console.log(usersData);
                
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false); 
            }
        };

        getUsers();
    }, []);

    useEffect(() => {
        let filtered = customers;

        if (showCreditRequests) {
            filtered = filtered.filter(customer => customer.creditAccount === "request");
        }

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(lowercasedQuery)
            );
        }

        setFilteredCustomers(filtered);
    }, [searchQuery, customers, showCreditRequests]);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCustomer = async () => {
        setIsAdding(true);
        try {
            // Add the new customer via the signup handler (adjust according to your API call)
            await handleSignup(newCustomer.name, newCustomer.email, newCustomer.password);
            
            // After successfully adding the user, immediately update the customers state
            const newCustomerData = { 
                name: newCustomer.name, 
                email: newCustomer.email, 
                password: newCustomer.password, 
                creditAccount: 'active' // Assuming 'active' status for the new user
            };
    
            // Update both the customers and filteredCustomers state arrays
            setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);
            setFilteredCustomers(prevFiltered => [...prevFiltered, newCustomerData]);
    
            // Close the modal and reset form fields
            setIsModalOpen(false);
            setNewCustomer({ name: '', email: '', password: '' }); // Reset the form
        } catch (error) {
            console.error('Error adding customer:', error);
        } finally {
            setIsAdding(false);
        }
    };
    

    const handleShowCreditRequests = () => {
        setShowCreditRequests(prev => !prev);
    };

    return (
        <>
            {loading ? (
                <PreLoader />
            ) : (
                <div className='w-full bg-slate-100'>
                    <NavbarAdmin />
                    <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
                        <h1 className="text-center font-primary text-3xl">Customers</h1>
                        <div className='flex justify-end space-x-3 items-center font-secondary mb-2'>
                            <button
                                className="rounded-full bg-black px-5 text-white h-8"
                                onClick={handleModalOpen}
                                disabled={isAdding}
                            >
                                {isAdding ? 'Adding...' : '+ Add new user'}
                            </button>
                            <button
                                className={`rounded-full px-5 text-white h-8 ${showCreditRequests ? 'bg-gray-700' : 'bg-black'}`}
                                onClick={handleShowCreditRequests}
                                disabled={isAdding}
                            >
                                {showCreditRequests ? 'Show All Users' : 'Show Credit Requests'}
                            </button>
                            <Search
                                type="text"
                                className="font-body font-medium w-40 rounded-full"
                                placeholder='Search user'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <DataTable data={filteredCustomers} columns={CustomerColumn} />
                    </main>
                    <FooterAdmin />
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
                <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
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
