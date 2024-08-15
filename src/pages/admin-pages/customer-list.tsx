import { useEffect, useState } from 'react';
import { Search } from '@/components/_ui/search';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { DataTable } from '@/components/tables/data-table';
import { CustomerColumn } from '@/components/tables/customers-column';
import { fetchAllUsers } from '@/services/db-services'; // Import the service

function CustomerList() {
    const [customers, setCustomers] = useState([]); 
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');  
    const [loading, setLoading] = useState(true);   

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

    return (
        <div className='w-full bg-slate-100'>
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
                <h1 className="text-center font-primary text-3xl">
                    Customers
                </h1>
                <div className='flex justify-end space-x-3 items-center font-secondary mb-2'>
                    <button
                        className="rounded-full bg-black px-5 text-white h-8"
                    >
                        + Add new user
                    </button>
                    {/* Search Input */}
                    <Search 
                        type="text" 
                        className="font-body font-medium w-40" 
                        placeholder='Search user'
                        value={searchQuery} // Bind input value to state
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    />
                </div>

                {/* Conditionally render the DataTable if data is loaded */}
                {loading ? (
                    <p>Loading customers...</p>
                ) : (
                    <DataTable data={filteredCustomers} columns={CustomerColumn}/>
                )}
            </main>
            <FooterAdmin />
        </div>
    );
}

export default CustomerList;
