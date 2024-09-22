import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  Text,
  Tooltip,
  MenuDivider,
  MenuItem,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "../miscellaneous/ProfileModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatComponents/ChatLoading";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";

const SideDrawer = () =>  {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const { user, setUser, setselectedChat, chats, setChats } = ChatState();
  const Navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    Navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Invalid Input",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("above line 70");
      const { data } = await axios.get(`/api/users?search=${search}`, config);

      setLoading(false);
      console.log('line74 sideDrawer',data);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chats`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setselectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px">
        <Tooltip label="search user" hasArrow placeItems={"bottom-end"}>
          <Button variant={"ghost"} onClick={onOpen}>
            <Search2Icon />
            <Text display={{ base: "none", md: "flex" }} px={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text>Talk-Mate</Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize={"2xl"} m={2} />
            </MenuButton>
            <MenuList></MenuList>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>

              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>logout</MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search contact</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner emptyColor="gray.200" speed="0.95s" ml="auto" d="flex" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
