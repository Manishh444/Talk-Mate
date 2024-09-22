import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="45px" borderRadius={"10px"} />
      <Skeleton height="45px" borderRadius={"10px"} />
      <Skeleton height="45px" borderRadius={"10px"} />
    </Stack>
  );
};

export default ChatLoading;