'use client';
import { Tabs, TabsRef } from 'flowbite-react';
import { useRef } from 'react';
import { HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';

type props = {
  setSignUp: (value: boolean) => void;
};

export const LoginTabs = (props: props) => {
  const tabsRef = useRef<TabsRef>(null);
  const handleTabChange = (activeTab: number) => {
    props.setSignUp(activeTab === 1);
  };

  return (
    <Tabs
      theme={{
        tablist: {
          styles: {
            fullWidth: 'rounded-lg text-gray-400 text-sm uppercase gap-1',
          },
          tabitem: {
            styles: {
              fullWidth: {
                active: {
                  on: 'text-white  focus:outline-none focus:ring-2 focus:rounded-lg focus:ring-white w-1/2',
                },
                base: 'bg-gray-500  text-gray-400 focus:outline-none focus:ring-2 focus:rounded-lg focus:ring-white w-1/2',
              },
            },
          },
        },
      }}
      onActiveTabChange={handleTabChange}
      ref={tabsRef}
      aria-label="Full width tabs"
      className="flex justify-center text-white"
      style="fullWidth">
      <Tabs.Item active title="Login" icon={HiUserCircle}>
        {/* <h2 className="m-auto flex w-fit text-xl uppercase  ">Sign In</h2> */}
      </Tabs.Item>
      <Tabs.Item title="Sign Up" icon={MdDashboard}>
        {/* <h2 className="m-auto flex w-fit text-xl uppercase">Sign Up</h2> */}
      </Tabs.Item>
    </Tabs>
  );
};
