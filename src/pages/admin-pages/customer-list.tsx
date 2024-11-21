/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Search } from "@/components/_ui/search";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { DataTable } from "@/components/tables/data-table";
import { CustomerColumn } from "@/components/tables/customers-column"; // CustomerColumn should be a function
import { fetchAllUsers } from "@/services/db-services";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import { Button } from "@/components/_ui/button";
import { deleteUser, handleSignup } from "@/services/auth";
import PreLoader from "@/components/pre-loader";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showCreditRequests, setShowCreditRequests] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchAllUsers();
        setCustomers(usersData);
        setFilteredCustomers(usersData);
        console.log(usersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (showCreditRequests) {
      filtered = filtered.filter(
        (customer) => customer.creditAccount === "request",
      );
    }

    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((customer) =>
        customer.name.toLowerCase().includes(lowercasedQuery),
      );
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, customers, showCreditRequests]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async () => {
    setIsAdding(true);
    try {
      await handleSignup(
        newCustomer.name,
        newCustomer.email,
        newCustomer.password,
      );

      const newCustomerData = {
        name: newCustomer.name,
        email: newCustomer.email,
        password: newCustomer.password,
        creditAccount: "active",
      };

      setCustomers((prevCustomers) => [...prevCustomers, newCustomerData]);
      setFilteredCustomers((prevFiltered) => [
        ...prevFiltered,
        newCustomerData,
      ]);

      setIsModalOpen(false);
      setNewCustomer({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleShowCreditRequests = () => {
    setShowCreditRequests((prev) => !prev);
  };

  const handleCreditStatusUpdate = (userId, newStatus) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === userId
          ? { ...customer, creditAccount: newStatus }
          : customer,
      ),
    );
  };
  const handleCustomerDelete = async (email: any) => {
    try {
      // Call the service to delete the user
      await deleteUser(email);

      // Remove the user from the local state
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.email !== email),
      );

      setFilteredCustomers((prevFilteredCustomers) =>
        prevFilteredCustomers.filter((customer) => customer.email !== email),
      );

      // Optionally, refetch all users from the server
      // const usersData = await fetchAllUsers();
      // setCustomers(usersData);
      // setFilteredCustomers(usersData);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <>
      {loading ? (
        <PreLoader />
      ) : (
        <div className="w-full bg-slate-100">
          <NavbarAdmin />
          <main className="m-auto flex min-h-screen flex-col space-y-6 px-[5%] py-5 pb-10">
            <h1 className="text-center font-primary text-3xl">Customers</h1>
            <div className="mb-2 flex items-center justify-end space-x-3 font-secondary">
              <button
                className="h-8 rounded-full bg-black px-5 text-white"
                onClick={handleModalOpen}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "+ Add new user"}
              </button>
              <button
                className={`h-8 rounded-full px-5 text-white ${showCreditRequests ? "bg-gray-700" : "bg-black"}`}
                onClick={handleShowCreditRequests}
                disabled={isAdding}
              >
                {showCreditRequests ? "Show All Users" : "Show Credit Requests"}
              </button>
              <Search
                type="text"
                className="w-40 rounded-full font-body font-medium"
                placeholder="Search user"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-10 flex min-h-[150px] min-w-[500px] flex-col space-y-8 rounded-md border bg-white p-8 shadow-xl">
              {/* Pass the handleCreditStatusUpdate to CustomerColumn */}
              <DataTable
                data={filteredCustomers}
                columns={CustomerColumn(
                  handleCreditStatusUpdate,
                  handleCustomerDelete,
                )}
              />
            </div>
          </main>
          <FooterAdmin />
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Customer
            </DialogTitle>
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
              className="w-full rounded-full border p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Customer Email"
              value={newCustomer.email}
              onChange={handleNewCustomerChange}
              className="w-full rounded-full border p-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Customer Password"
              value={newCustomer.password}
              onChange={handleNewCustomerChange}
              className="w-full rounded-full border p-2"
            />
            <div className="mt-4 flex justify-end space-x-2 font-secondary">
              <Button
                variant="default"
                onClick={handleAddCustomer}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add Customer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomerList;
