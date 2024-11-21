import { useEffect } from "react";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { Button } from "@/components/_ui/button";
import { useNavigate } from "react-router-dom";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { formatCuttingTime } from "@/utils/format-cutting-time";
import { useStripeCheckout } from "@/stripe/hooks/useStripeCheckout";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSavePartsAndQuote } from "@/services/db-services";
import {
  setShippingOption,
  setShippingAddress,
  setCustomQuoteID,
} from "@/redux/slices/quote-parts-slice";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/_ui/input";

function QuoteSummary() {
  const CurrentLoggedinUser = useSelector((state: RootState) => state.auth);
  const { savePartsAndQuote, loading: saveLoading } = useSavePartsAndQuote(
    "in progress",
    "yes",
  );

  const navigate = useNavigate();
  const parts = useSelector((state: RootState) => state.quoteParts.parts);
  const MIN_COST = 120;
  const TAX_RATE = 0.15;

  const totals = parts.reduce(
    (acc, file) => {
      acc.totalCuttingTime += file.cuttingTime * file.quantity || 0;
      acc.totalCost += file.totalCost || 0;
      acc.totalQuantity += file.quantity;
      return acc;
    },
    { totalCuttingTime: 0, totalCost: 0, totalQuantity: 0 },
  );

  const costAdjustment =
    totals.totalCost < MIN_COST ? MIN_COST - totals.totalCost : 0;
  const adjustedTotalCost = totals.totalCost + costAdjustment;

  const taxAmount = adjustedTotalCost * TAX_RATE;
  const totalCostAfterTax = adjustedTotalCost + taxAmount;

  const auth = getAuth();
  const [user, loadingAuth] = useAuthState(auth);
  const { initiateCheckout, loading: checkoutLoading } = useStripeCheckout();

  const dispatch = useDispatch();
  const shippingOption = useSelector(
    (state: RootState) => state.quoteParts.shippingOption,
  );
  const shippingAddress = useSelector(
    (state: RootState) => state.quoteParts.shippingAddress,
  );
  const customQuoteID = useSelector(
    (state: RootState) => state.quoteParts.customQuoteID,
  );

  const handleShippingOptionChange = (option: "pickup" | "delivery") => {
    dispatch(setShippingOption(option));
    if (option === "delivery") {
      // Auto-fill the address if the delivery option is selected
      if (CurrentLoggedinUser.address) {
        dispatch(setShippingAddress(CurrentLoggedinUser.address));
      }
    } else {
      // Clear the address when switching to pickup
      dispatch(setShippingAddress(""));
    }
  };

  const handleShippingAddressChange = (address: string) => {
    dispatch(setShippingAddress(address));
  };

  const handleCustomQuoteIDChange = (id: string) => {
    dispatch(setCustomQuoteID(id));
  };

  useEffect(() => {
    console.log(parts);
  }, [parts]);

  const handleCheckout = async () => {
    if (!user) {
      console.error("User not authenticated");
      alert("Please sign in to proceed.");
      return;
    }

    if (CurrentLoggedinUser.creditAccount === "verified") {
      savePartsAndQuote();
      return;
    }

    const amount = totals.totalCost;
    let successUrl = "";
    if (CurrentLoggedinUser.role === "admin") {
      successUrl = window.location.origin + "/admin/quotes";
    } else {
      successUrl = window.location.origin + "/quotes/history";
    }
    const cancelUrl = window.location.origin + "/quotes/history";

    await initiateCheckout(amount, successUrl, cancelUrl);
  };

  if (loadingAuth) {
    return <></>;
  }

  if (!user) {
    return <div>Please sign in to proceed.</div>;
  }

  const isLoading = checkoutLoading || saveLoading;
  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">
          Create a new quote
        </h1>
        <CreateNewQuoteSteper currentStep={2} />

        <div className="mt-8 w-full rounded-lg border bg-gray-50 p-6 shadow-sm">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
            Review Your Quote
          </h2>

          <div className="flex flex-wrap items-center justify-between border-b border-gray-300 py-2 font-semibold text-gray-700 sm:flex-nowrap">
            <div className="w-full sm:w-1/4">Name</div>
            <div className="w-full text-center sm:w-1/6">Material</div>
            <div className="w-full text-center sm:w-1/6">Quantity</div>
            <div className="w-full text-center sm:w-1/6">Cutting Time</div>
            <div className="w-full text-right sm:w-1/6">Cost</div>
          </div>

          <div className="space-y-4">
            {parts.map((file) => (
              <div
                key={file.id}
                className="flex flex-wrap items-center justify-between border-b border-gray-200 py-4 sm:flex-nowrap"
              >
                <div className="w-full truncate font-medium text-gray-700 sm:w-1/4">
                  {file.name}
                </div>
                <div className="mt-2 flex w-full justify-center text-gray-500 sm:mt-0 sm:w-1/6">
                  {file.material?.name}
                </div>
                <div className="mt-2 flex w-full justify-center text-gray-500 sm:mt-0 sm:w-1/6">
                  {file.quantity}
                </div>
                <div className="mt-2 flex w-full justify-center text-gray-500 sm:mt-0 sm:w-1/6">
                  {formatCuttingTime(file.cuttingTime * file.quantity)}
                </div>
                <div className="w-full text-right font-semibold text-gray-900 sm:w-1/6">
                  Cost: ${file.totalCost?.toFixed(2)}
                </div>
              </div>
            ))}

            {costAdjustment > 0 && (
              <div className="flex flex-wrap items-center justify-between border-b border-gray-200 py-4 sm:flex-nowrap">
                <div className="w-full truncate font-medium text-gray-700 sm:w-1/4">
                  Minimum Cost Adjustment
                </div>
                <div className="w-full text-right font-semibold text-gray-900 sm:w-1/6">
                  Cost: ${costAdjustment.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-around sm:space-y-0">
              {/* Column 1 */}
              <div className="flex w-1/3 flex-col items-end justify-start space-y-2">
                <div className="flex space-x-2">
                  <span className="font-medium text-gray-700">
                    Total Cutting Time:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCuttingTime(totals.totalCuttingTime)}
                  </span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex w-1/3 flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Total Quantity:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {totals.totalQuantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Tax Rate (15%):
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex w-1/3 flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Total Cost:</span>
                  <span className="font-semibold text-gray-900">
                    ${adjustedTotalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Total Cost After Tax:
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${totalCostAfterTax.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">
            Shipping Options
          </h3>

          <RadioGroup
            className="mt-4 flex flex-col space-y-3"
            value={shippingOption}
            onValueChange={(value) =>
              handleShippingOptionChange(value as "pickup" | "delivery")
            }
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                id="pickup-option"
                value="pickup"
                className="h-5 w-5 rounded-full border-2 border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-300"
              >
                {shippingOption === "pickup" && (
                  <div className="m-auto h-3 w-3 rounded-full bg-black" />
                )}
              </RadioGroupItem>
              <Label
                htmlFor="pickup-option"
                className="cursor-pointer text-gray-700"
              >
                Pick-up
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem
                id="delivery-option"
                value="delivery"
                className="h-5 w-5 rounded-full border-2 border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-300"
              >
                {shippingOption === "delivery" && (
                  <div className="m-auto h-3 w-3 rounded-full bg-black" />
                )}
              </RadioGroupItem>
              <Label
                htmlFor="delivery-option"
                className="cursor-pointer text-gray-700"
              >
                Delivery
              </Label>
            </div>
          </RadioGroup>

          {/* Delivery Address Input Field */}
          {shippingOption === "delivery" && (
            <div className="mt-6">
              <Label
                htmlFor="delivery-address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Delivery Address
              </Label>
              <Input
                id="delivery-address"
                type="text"
                value={shippingAddress}
                onChange={(e) => handleShippingAddressChange(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-3 text-xl font-semibold text-gray-800">
              Custom Quote ID
            </h3>
            <Input
              id="custom-quote-id"
              type="text"
              value={customQuoteID} // Fetch this value from Redux state
              onChange={(e) => handleCustomQuoteIDChange(e.target.value)} // Call the handler
              placeholder="Enter your custom quote ID"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="mt-10 flex space-x-4">
          <Button
            variant="outline"
            className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => navigate("/quotes/new-quote")}
          >
            Back
          </Button>
          <Button
            variant="default"
            className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Checkout..." : "Checkout"}
          </Button>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}

export default QuoteSummary;
