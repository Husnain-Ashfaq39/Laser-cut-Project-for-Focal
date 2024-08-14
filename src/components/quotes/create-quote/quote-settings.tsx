import QuotePlaceholderImage from "@/assets/quotes/quote-preview-placeholder.png";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { Switch } from "@/components/_ui/switch";
import HorizontalDevider from "@/assets/quotes/horizontal-devider.svg";

const QuoteSettings: React.FC = () => {
  return (
    <div className="m-auto w-[90%] py-5 ">
      <section className="h-[30px] bg-[#F7F9FC] p-1">
        <h1>Part - Lorum Epsum</h1>
      </section>
      <section className="bg-[#76787317] text-sm">
        <div className="flex flex-row">
          <div className="mx-4 my-2 flex w-1/3 flex-col items-center">
            <div>
              <img
                src={QuotePlaceholderImage}
                className="h-[180px] w-[300px] rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-400">Past Preview</p>
          </div>
          <div className="my-2 flex w-2/3 flex-col">
            <h1>Settings</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-xs">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="first-name"
                  placeholder="2"
                  className="w-[80%]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cutting-technology">Cutting technology</Label>
                <Input
                  id="cutting-technology"
                  placeholder="laser"
                  className="w-[80%]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  placeholder="silk"
                  className="w-[80%]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Consumption mode</Label>
                <Input
                  id="consumption-mode"
                  placeholder="2"
                  className="w-[80%]"
                  required
                />
              </div>
              <div className="m- flex flex-row items-center space-x-2 py-1">
                <h1>Customer supplied material</h1>
                <Switch />
              </div>
            </div>
          </div>
        </div>
        <img src={HorizontalDevider} className="px-3 py-2" />
        <div className="px-8">
          <h1 className="text-lg font-semibold">Prices</h1>

          <div className="grid w-[60%] grid-cols-2 gap-4 pb-8 pt-2">
            <div className="grid gap-2 text-xs">
              <Label htmlFor="quantity">Material</Label>
              <Input
                id="first-name"
                placeholder="2"
                className="w-[80%]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cutting-technology" className="text-xs">
                Cutting
              </Label>
              <Input
                id="cutting-technology"
                placeholder="laser"
                className="w-[80%]"
                required
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex h-[75px] flex-row items-center justify-between rounded-b-xl bg-black px-5 text-white">
        <h1>Subtotal :</h1>
        <h1>$1,4,04990</h1>
      </section>
      <h1 className="text-[#518EF8] text-sm py-4 px-1 font-semibold">Remove Part</h1>
    </div>
  );
};

export default QuoteSettings;
