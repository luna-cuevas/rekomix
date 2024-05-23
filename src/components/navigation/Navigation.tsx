"use client";
import React, { useEffect, useState } from "react";
import { Avatar, DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import LoginModal from "./LoginModal";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Props = {};

const Navigation = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = supabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoaded(true);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      setState((prev) => ({
        ...prev,
        session: null,
        user: null,
        showMobileMenu: false,
      }));

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Navbar fluid rounded className="bg-neutral-200">
        <Navbar.Brand href="https://flowbite-react.com">
          {/* <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        /> */}
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            RekoMix
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2 gap-2">
          {state.user != null && isLoaded ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                />
              }>
              <Dropdown.Header>
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">
                  name@flowbite.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSignOut()}>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <button
              type="button"
              className="dark:text-white"
              onClick={() => {
                setShowLoginModal(!showLoginModal);
              }}>
              Login
            </button>
          )}
          <DarkThemeToggle />
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">Discover</Navbar.Link>
          <Navbar.Link href="#">Genres</Navbar.Link>
          <Navbar.Link href="#">Moods</Navbar.Link>
          <Navbar.Link href="#">Artists</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </>
  );
};

export default Navigation;
