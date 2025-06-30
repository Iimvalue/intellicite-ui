// import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// // import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import { GiHamburgerMenu } from "react-icons/gi";
// import { MdOutlineCancelPresentation } from "react-icons/md";
// import { Link, useNavigate } from 'react-router-dom';
// import { logout } from '../services/authService';

// function Nav() {
//  const Token = localStorage.getItem('token');
//  const navigate = useNavigate();

//   const navigation = [
//     { name: 'Home', to: '/', current: true },
//     { name: 'Save Papers', to: '/save-papers', current: false },
//     { name: 'History', to: '/history', current: false },
//     { name: 'Citation Evaluation', to: '/citation', current: false },

//   ];
//   if (!Token) {
//     navigation.push({ name: 'Log In', to: '/login', current: false });
//   }

//   function classNames(...classes) {
//     return classes.filter(Boolean).join(' ');
//   }
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <Disclosure as="nav" className="bg-white border-b border-gray-200 shadow-[0_2px_8px_0_rgba(0,0,0,0.03)]">
//       <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
//         <div className="relative flex h-16 items-center justify-between">
//           {/* Mobile menu button */}
//           <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//             <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
//               <span className="absolute -inset-0.5" />
//               <span className="sr-only">Open main menu</span>
//               <GiHamburgerMenu
//                 aria-hidden="true"
//                 className="block size-6 group-data-open:hidden"
//               />
//               <MdOutlineCancelPresentation
//                 aria-hidden="true"
//                 className="hidden size-6 group-data-open:block"
//               />
//             </DisclosureButton>
//           </div>
//           <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
//             <div className="flex shrink-0 items-center">
//               <Link to="/">
//                 <img
//                   src="/lets-chat-logo-grayscale.png"
//                   className="h-8 w-auto"
//                   alt=""
//                 />
//               </Link>
//             </div>
//             {/* desktop navigation */}
//             <div className="hidden sm:ml-6 sm:block">
//               <div className="flex space-x-4">
//                 <img src="/Intellicite-logo.jpg"
//                 alt="Intellicite logo"
//                 className="h-10 w-auto rounded-4xl"
//                  />
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.to}
//                     aria-current={item.current ? 'page' : undefined}
//                     className={classNames(
//                       item.current
//                         ? 'bg-gray-900 text-white'
//                         : 'text-gray-300 hover:bg-gray-700 hover:text-white absolute right-15',
//                       'rounded-md px-3 py-2 text-sm font-medium'
//                     )}
//                   >
//                     {item.name}
//                   </Link>

//                 ))}
//               </div>

//             </div>
//           </div>

//           <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//             {/* Profile dropdown */}
//             <Menu as="div" className="relative ml-3">
//               <div>
//                 <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
//                   <span className="absolute -inset-1.5" />
//                   <span className="sr-only">Open user menu</span>
//                   <img
//                     alt=""
//                     src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
//                     className="size-10 rounded-full object-cover"
//                   />
//                 </MenuButton>
//               </div>
//               <MenuItems
//                 transition
//                 className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
//               >
//                 <MenuItem>
//                   <Link
//                     to="/userProfile"
//                     className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                   >
//                     Your Profile
//                   </Link>
//                 </MenuItem>
//                 <MenuItem>
//                   <a
//                     href="#"
//                     onClick={handleLogout}
//                     className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                   >
//                     Sign out
//                   </a>
//                 </MenuItem>
//               </MenuItems>
//             </Menu>
//           </div>

//         </div>
//       </div>

//       <DisclosurePanel className="sm:hidden">
//         <div className="space-y-1 px-2 pt-2 pb-3">
//           {navigation.map((item) => (
//             <DisclosureButton
//               key={item.name}
//               as={Link}
//               to={item.to}
//               aria-current={item.current ? 'page' : undefined}
//               className={classNames(
//                 item.current
//                   ? 'bg-gray-900 text-white'
//                   : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                 'block rounded-md px-3 py-2 text-base font-medium'
//               )}
//             >
//               {item.name}
//             </DisclosureButton>
//           ))}
//         </div>
//       </DisclosurePanel>
//     </Disclosure>
//   );
// }

// export default Nav;

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function Nav() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const navigation = [
    { name: "Home", to: "/" },
    { name: "Save Papers", to: "/save-papers" },
    { name: "History", to: "/history" },
    { name: "Citation", to: "/citation" },
  ];

  if (!token) {
    navigation.push({ name: "Log In", to: "/login" });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (to) => {
    if (to === "/" && currentPath === "/") return true;
    if (to !== "/" && currentPath.startsWith(to)) return true;
    return false;
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-200 shadow-[0_2px_8px_0_rgba(0,0,0,0.03)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="relative flex h-16 items-center justify-between">
          {/* NAV MENUE */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <GiHamburgerMenu className="block size-6 group-data-open:hidden" />
              <MdOutlineCancelPresentation className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* LOGO AND LINKS*/}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
              <div className="flex shrink-0 items-center">
                <Link to="/">
                  <img
                    src="/Intellicite-logo.jpg"
                    alt="Logo"
                    className="h-10 w-auto rounded-4xl"
                  />
                </Link>
              </div>

              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={`px-3 py-2 text-sm  rounded-md ${
                        isActive(item.to)
                          ? "bg-gray-100 font-bold backdrop-blur-md text-gray-700"  // هنا التغيير للبيوينتر
                          : "text-gray-700 hover:bg-gray-100 hover:font-bold"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          {/* Profile dropdown */}
          {token && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="size-10 rounded-full object-cover"
                      src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                      alt="user avatar"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    <Link
                      to="/userProfile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.to}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(item.to)
                  ? "bg-gray-100 font-bold backdrop-blur-md text-gray-700"
                  : "text-gray-700 hover:bg-gray-100 hover:font-bold" //
              }`}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Nav;
