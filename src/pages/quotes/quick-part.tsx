import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/_ui/button";
import NavbarAdmin from "@/components/nav/navbar-admin";
import FooterAdmin from "@/components/footer/footer-admin";
import { Input } from "@/components/_ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/_ui/dialog";
import { addFile } from "@/redux/slices/quote-parts-slice";
import { useToast } from "@/components/_ui/toast/use-toast";

type ShapeParameter = {
  shortName: string;
  name: string;
  default: number;
};

type Loop = {
  name: string;
  countParam: string;
  template: string;
};

type Shape = {
  name: string;
  parameters: ShapeParameter[];
  dependencies: { [key: string]: string };
  loops?: Loop[];
  svgContent: string;
  svgPreview: string;
};

const QuickPart: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { shape } = (location.state as { shape: Shape }) || {};
  const [partName, setPartName] = useState<string>(shape?.name || "");

  // Initialize state for parameters
  const [params, setParams] = useState<{ [key: string]: number }>(
    shape?.parameters.reduce(
      (acc, param) => {
        acc[param.shortName] = param.default;
        return acc;
      },
      {} as { [key: string]: number },
    ) || {},
  );

  // Scroll to top when component mounts or shape changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [shape]);

  // Redirect to parametric library if shape is undefined
  useEffect(() => {
    if (!shape) {
      navigate("/quotes/new-quote/parametric-library");
    }
  }, [shape, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: parseFloat(value),
    });
  };

  const resetMeasurements = () => {
    const defaultParams = shape?.parameters.reduce(
      (acc, param) => {
        acc[param.shortName] = param.default;
        return acc;
      },
      {} as { [key: string]: number },
    );
    setParams(defaultParams);
  };

  const resolveDependencies = (
    dependencies: { [key: string]: string },
    params: { [key: string]: number },
  ) => {
    const resolvedDependencies: { [key: string]: number } = {};
    for (const [key, expr] of Object.entries(dependencies)) {
      if (typeof expr === "string") {
        const resolvedValue = expr.replace(/\{(\w+)\}/g, (_, p1) => {
          if (params[p1] !== undefined) {
            return params[p1].toString();
          }
          if (resolvedDependencies[p1] !== undefined) {
            return resolvedDependencies[p1].toString();
          }
          return "0";
        });
        try {
          resolvedDependencies[key] = eval(resolvedValue);
        } catch (error) {
          console.error(`Error evaluating dependency: ${expr}`, error);
          resolvedDependencies[key] = 0;
        }
      } else {
        console.error(
          `Expected string but got ${typeof expr} for dependency key ${key}`,
        );
        resolvedDependencies[key] = 0;
      }
    }
    return resolvedDependencies;
  };

  const processLoops = (
    svgContent: string,
    loops: Loop[],
    params: { [key: string]: number },
    resolvedDependencies: { [key: string]: number },
  ) => {
    if (!loops) return svgContent;

    loops.forEach((loop) => {
      let loopContent = "";
      const loopCount =
        params[loop.countParam] !== undefined ? params[loop.countParam] : 0;

      for (let i = 0; i < loopCount; i++) {
        let itemContent = loop.template.replace(/\{i\}/g, i.toString());

        // Replace placeholders with actual values
        itemContent = itemContent.replace(/\{([^}]+)\}/g, (_, expr) => {
          const evalExpr = new Function(
            "i",
            ...Object.keys(params),
            ...Object.keys(resolvedDependencies),
            `return ${expr};`,
          );
          try {
            return evalExpr(
              i,
              ...Object.values(params),
              ...Object.values(resolvedDependencies),
            );
          } catch (error) {
            console.error(`Error evaluating expression: ${expr}`, error);
            return `{${expr}}`;
          }
        });

        loopContent += itemContent;
      }

      // Replace the placeholder in the svgContent with generated loop content
      const regex = new RegExp(`{${loop.name}}`, "g");
      svgContent = svgContent.replace(regex, loopContent);
    });

    return svgContent;
  };

  const renderSVGContent = () => {
    let svgContent = shape?.svgContent || "";

    const resolvedDependencies = resolveDependencies(
      shape?.dependencies || {},
      params,
    );

    // Process loops if any
    if (shape?.loops) {
      svgContent = processLoops(
        svgContent,
        shape.loops,
        params,
        resolvedDependencies,
      );
    }

    // Replace remaining placeholders with actual values
    for (const [key, value] of Object.entries(params)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      svgContent = svgContent.replace(regex, value.toString());
    }

    for (const [key, value] of Object.entries(resolvedDependencies)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      svgContent = svgContent.replace(regex, value.toString());
    }

    svgContent = svgContent.replace(/\{([^}]+)\}/g, (_, expr) => {
      const evalExpr = new Function(
        ...Object.keys(params),
        ...Object.keys(resolvedDependencies),
        `return ${expr};`,
      );
      try {
        return evalExpr(
          ...Object.values(params),
          ...Object.values(resolvedDependencies),
        ).toString();
      } catch (error) {
        console.error(`Error evaluating expression: ${expr}`, error);
        return `{${expr}}`;
      }
    });

    return svgContent;
  };
  const { toast } = useToast();
  const handleSaveSVG = () => {
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const fileName = partName || shape?.name;
    const svgFile = new File([svgBlob], `${fileName}.svg`, {
      type: "image/svg+xml",
    });

    // Dispatch action to add the file with partName
    dispatch(
      addFile({
        id: uuidv4(),
        file: svgFile,
        fileType: "svg",
        name: fileName,
        isValid: false,
        material: undefined,
        cuttingTechnology: undefined,
        quantity: 1,
      }),
    );

    navigate("/quotes/new-quote");
    toast({
      variant: "default",
      title: `${fileName} Added Successfully!`,
      description: "You have successfully added your part.",
      duration: 2000,
    });
  };

  const [svgContent, setSvgContent] =
    React.useState<string>(renderSVGContent());

  React.useEffect(() => {
    if (shape) {
      setSvgContent(renderSVGContent());
    }
  }, [params, shape]);

  const navigateBack = () => {
    navigate("/quotes/new-quote/parametric-library", {
      state: { selectedCategory: location.state?.selectedCategory },
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 font-secondary">
      <NavbarAdmin />
      <main className="flex w-full flex-col items-center p-6">
        <h3 className="mb-6 text-2xl font-semibold">
          Add from Parametric Library
        </h3>
        <section className="w-full max-w-7xl rounded-lg border border-gray-300 bg-white p-6">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
            <div className="w-full md:w-4/12">
              <div className="mb-6">
                <Link
                  to="/quotes/new-quote/parametric-library"
                  state={{ selectedCategory: location.state?.selectedCategory }}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Go back to shape selection
                </Link>
              </div>
              <div className="mb-8">
                <label className="text-md mb-2 block font-semibold">
                  Enter the Part Name
                </label>
                <Input
                  type="text"
                  className="w-full rounded-lg border-gray-300 text-sm"
                  placeholder="Part Name"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <b className="text-md mb-2 block">Add measurements</b>
                <div className="grid grid-cols-2 gap-4">
                  {shape?.parameters.map((param) => (
                    <div key={param.shortName}>
                      <label className="mb-1 block text-sm">{param.name}</label>
                      <Input
                        type="number"
                        name={param.shortName}
                        value={params[param.shortName]}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full font-bold"
                  onClick={resetMeasurements}
                >
                  Reset Measurements
                </Button>
              </div>

              {/* Inline SVG Preview and Click to Show Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="mb-8 cursor-pointer"
                    dangerouslySetInnerHTML={{
                      __html: shape?.svgPreview || "",
                    }}
                  ></div>
                </DialogTrigger>
                <DialogContent>
                  <div
                    className="flex items-center justify-center"
                    dangerouslySetInnerHTML={{
                      __html: shape?.svgPreview || "",
                    }}
                  ></div>
                  <DialogClose />
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex h-screen w-full flex-col md:w-8/12">
              <div className="mb-4">
                <b className="mb-2 block text-center text-lg font-semibold">
                  {shape?.name}
                </b>
              </div>
              <div
                className="flex flex-1 items-center justify-center"
                dangerouslySetInnerHTML={{
                  __html: svgContent,
                }}
              ></div>
            </div>
          </div>
          <div className="mt-6 flex w-full justify-end">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={navigateBack}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="rounded-full"
                onClick={() => {
                  handleSaveSVG();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default QuickPart;
