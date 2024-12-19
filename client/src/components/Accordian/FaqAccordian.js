import React from "react";
import { Disclosure } from "@headlessui/react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaqData } from "../../constants/FaqData";

const FaqAccordian = () => {
  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full rounded-2xl bg-white p-6 ">
        {FaqData?.map((data) => (
          <Disclosure key={data?.id}>
            {({ open }) => (
              <div className="shadow-md p-4 rounded-lg overflow-hidden  bg-[#f3f4f6] mt-4">
                <Disclosure.Button className="flex w-full mt-4 justify-between rounded-lg  text-left text-lg  font-normal text-black-900  focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ">
                  <span>{data?.que}</span>
                  {open ? (
                    <AiOutlineMinus className="h-5 w-5 text-black-900" />
                  ) : (
                    <AiOutlinePlus className="text-black-900" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 font-normal text-gray-500 text-base ">
                  {data?.ans}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default FaqAccordian;
