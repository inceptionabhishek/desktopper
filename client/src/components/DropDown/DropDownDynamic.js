import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DropDownDynamic(props) {
  const {
    data,
    selectedOption,
    setSelectedOption,
    option,
    placeholder,
    displayKey,
    check,
  } = props;

  const handleMenuItemClick = (value) => {
    setSelectedOption(value);
  };
  const dataWithAllOption =
    check === "project"
      ? [{ id: "all", [displayKey]: "All" }, ...data]
      : [...data];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div style={{ width: "200px" }}>
        <Menu.Button className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <p className="whitespace-nowrap overflow-hidden backdrop-blur dropdown-heading">
            {selectedOption ? option : placeholder}
          </p>
          <BsChevronDown className="mr-1 mt-1 text-gray" aria-hidden="true" />
        </Menu.Button>
      </div>
      {dataWithAllOption.length > 0 && (
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 mt-2 min-w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {dataWithAllOption.map((item) => (
                <>
                  <Menu.Item key={item.id}>
                    {({ active }) => (
                      <Link
                        to="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-2 py-2 text-sm"
                        )}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        {item[displayKey]}
                      </Link>
                    )}
                  </Menu.Item>
                </>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
}
