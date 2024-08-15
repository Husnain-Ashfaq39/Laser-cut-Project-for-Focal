import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/_ui/button";
import NavbarAdmin from "@/components/nav/navbar-admin";
import FooterAdmin from "@/components/footer/fouter-admin";
import { Input } from "@/components/_ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/_ui/dialog";

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

const AddFromParametricLibrary: React.FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shape } = (location.state as { shape: Shape }) || {};

  // Redirect to parametric library if shape is undefined
  React.useEffect(() => {
    if (!shape) {
      navigate("/quotes/new-quote/parametric-library");
    }
  }, [shape, navigate]);

  const [params, setParams] = React.useState<{ [key: string]: number }>(
    shape?.parameters.reduce(
      (acc, param) => {
        acc[param.shortName] = param.default;
        return acc;
      },
      {} as { [key: string]: number },
    ) || {},
  );

  const [partName, setPartName] = React.useState<string>(shape?.name || "");
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: parseFloat(value),
    });
     
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

  const [svgContent, setSvgContent] =
    React.useState<string>(renderSVGContent());

  React.useEffect(() => {
    if (shape) {
      setSvgContent(renderSVGContent());
    }
  }, [params, shape]);

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
                  to=""
                  onClick={() =>
                    navigate("/quotes/new-quote/parametric-library")
                  }
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
              <div className="mb-10">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full font-bold"
                      
                    >
                      View Preview
                    </Button>
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
              </div>
            </div>
            <div className="w-full md:w-8/12">
              <div className="mb-4">
                <b className="mb-2 block text-center text-lg font-semibold">
                  {shape?.name}
                </b>
              </div>
              <div
                className="mb-6 flex h-screen items-center justify-center"
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
                onClick={() => navigate("/quotes/new-quote/parametric-library")}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="rounded-full"
                onClick={() => {
                  navigate("/quotes/history");
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

export default AddFromParametricLibrary;
