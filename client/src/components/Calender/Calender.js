import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Calendar from "react-calendar";
import { AiOutlineCalendar } from "react-icons/ai";
import "react-calendar/dist/Calendar.css";
import "./Calender.css";

function Calender({ date, setDate }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <div
            className="flex flex-column justify-between Calender -mr-1 h-5 w-80 text-gray-400"
            aria-hidden="true"
          >
            {date.length > 0 ? (
              <p className="text-center dateText">
                {date[0].toDateString()}
                &nbsp;to&nbsp;
                {date[1].toDateString()}
              </p>
            ) : (
              <p className="text-center dateText">
                {date.toDateString()}
                &nbsp;to&nbsp;
                {date.toDateString()}
              </p>
            )}
            <p className="dateText">|</p>
            <AiOutlineCalendar size={18} className="text-blue-400" />
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              selectRange={true}
              maxDate={new Date()}
            />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default Calender;
