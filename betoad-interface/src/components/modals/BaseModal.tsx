import React from "react";
import bg from "../assets/images/bg.png";
import bh from "../assets/images/blackhole.jpg";
import ReactFullpage from "@fullpage/react-fullpage";
import { MdDoubleArrow } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { SiGitbook } from "react-icons/si";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const BaseModal = ({
  isOpen,
  onClose,
  className,
  title,
  children,
}: BaseModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-10 overflow-y-auto`}
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#99999999]" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1c1c1c] shadow-xl ${
                className || ""
              }`}
            >
              <div className="flex items-center">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 text-white"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className="grow flex justify-end">
                  <button className="focus:outline-none" onClick={onClose}>
                    <AiOutlineClose className="block text-white" />
                  </button>
                </div>
              </div>
              <div className="CONTENT">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BaseModal;
