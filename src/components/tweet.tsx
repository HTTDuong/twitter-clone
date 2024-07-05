import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: gold;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  margin: 14px 0px;
  border: 2px solid white;
  padding: 15px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const ChangePhotoInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: white;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const phoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(phoRef);
      }
    } catch (error) {
      console.error(error);
    } finally {
      //
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;

    setIsEditing((prev) => !prev);
    if (!isEditing) return;

    try {
      if (file !== null) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const imgUrl = await getDownloadURL(result.ref);
        updateDoc(doc(db, "tweets", id), {
          tweet: value,
          photo: imgUrl,
        });
      } else {
        await updateDoc(doc(db, "tweets", id), { tweet: value });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        return alert("Photo size too big! \n you can upload under 1MB");
      }
      setFile(files[0]);
    }
  };

  useEffect(() => {
    setValue(tweet);
  }, [tweet]);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <TextArea
            required
            rows={2}
            maxLength={200}
            onChange={onChange}
            value={value}
            placeholder="What is happening?"
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId ? (
          <EditButton onClick={onEdit}>
            {isEditing ? "Submit" : "Edit"}
          </EditButton>
        ) : null}
      </Column>
      <Column>
        {isEditing ? (
          <ChangePhotoInput
            onChange={onFileChange}
            id="file"
            accept="image/*"
            type="file"
          />
        ) : (
          photo && <Photo src={photo} />
        )}
      </Column>
    </Wrapper>
  );
}
