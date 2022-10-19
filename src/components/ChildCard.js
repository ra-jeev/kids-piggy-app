import { useEffect, useRef, useState } from 'react';

import { Storage } from '@aws-amplify/storage';
import {
  Flex,
  Heading,
  Image,
  Card,
  View,
  Text,
  Icon,
  Button,
  Alert,
} from '@aws-amplify/ui-react';
import { MdAddCircle, MdRemoveCircle, MdPhotoCamera } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

import { formatCurrency, formatDate } from '../utils';
import { AddPhotoDialog } from './AddPhotoDialog';

export const ChildCard = ({ child, currency, onTransact }) => {
  const inputRef = useRef(null);
  const [signedURL, setSignedURL] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFileDataURL, setSelectedFileDataURL] = useState(null);

  const onFilePicked = async (event) => {
    if (event.target.files && event.target.files.length) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const result = reader.result || null;
        setSelectedFileDataURL(result);
        setIsOpen(!!result);
      });

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSelectedFileDataURL(null);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const getPhotoUrl = async () => {
      const url = await Storage.get(child.photoUrlKey, {
        level: 'private',
        download: false,
      });

      setSignedURL(url);
    };

    if (child && child.photoUrlKey) {
      getPhotoUrl();
    }
  }, [child]);

  return (
    <Card borderRadius='medium' variation='elevated'>
      <Flex direction='column'>
        <Flex alignItems='center'>
          <View
            position='relative'
            fontSize={{ base: '4rem', large: '5rem' }}
            lineHeight='1'
            height={{ base: '4rem', large: '5rem' }}
          >
            {signedURL ? (
              <Image
                alt={`${child.name}'s profile photo`}
                src={signedURL}
                height={{ base: '4rem', large: '5rem' }}
                width={{ base: '4rem', large: '5rem' }}
                objectFit='cover'
                objectPosition='50% 50%'
                borderRadius='50%'
              />
            ) : (
              // <View fontSize={{ base: '4rem', large: '5rem' }} lineHeight='1'>
              <FaUserCircle

              // size={{ base: '4rem', large: '5rem' }}
              />
              // </View>
            )}

            <input
              type='file'
              style={{ display: 'none' }}
              ref={inputRef}
              accept='image/*'
              onChange={onFilePicked}
            />

            <Button
              position='absolute'
              right='0'
              bottom='0'
              size='small'
              padding='0.25rem'
              borderRadius='xl'
              backgroundColor='rgba(0, 0, 0, 0.48)'
              onClick={() => inputRef.current.click()}
            >
              <Icon ariaLabel='Change photo' as={MdPhotoCamera} />
            </Button>
          </View>

          <Flex direction='column' gap='0.25rem'>
            <Heading level={4} fontSize={{ base: 'large', large: 'xl' }}>
              {child.name}
            </Heading>
            <Text variation='info' fontSize='small'>
              Pocket money: {formatCurrency(child.pocketMoney || 0, currency)}
              {child.schedule
                ? `, ${
                    child.schedule[0] + child.schedule.slice(1).toLowerCase()
                  }`
                : ''}
            </Text>
          </Flex>
        </Flex>
        <Flex marginBlock='1rem' alignItems='center' direction='column'>
          <Flex alignItems='center'>
            <View textAlign='right'>
              <Text variation='info' fontSize='small'>
                Current balance
              </Text>
              <Heading
                level={2}
                color='brand.primary.80'
                fontSize={{ base: 'xxl', large: 'xxxl' }}
              >
                {formatCurrency(child.balance, currency)}
              </Heading>
            </View>
            <Heading fontSize={{ base: '3rem', large: '4rem' }} lineHeight='1'>
              💰
            </Heading>
          </Flex>
          {child.nextMoneyAt && (
            <Alert
              variation='info'
              isDismissible={false}
              hasIcon={true}
              fontSize='small'
            >
              Next Credit:{' '}
              <span style={{ fontSize: 'medium', fontWeight: 'bold' }}>
                {formatCurrency(child.pocketMoney, currency)}{' '}
              </span>{' '}
              on {formatDate(child.nextMoneyAt * 1000)}
            </Alert>
          )}
        </Flex>

        <Flex>
          <Button
            gap={{ base: '0.25rem', medium: '0.5rem' }}
            variation='primary'
            size='small'
            isFullWidth={true}
            onClick={() => onTransact(child)}
          >
            <Icon ariaLabel='add icon' as={MdAddCircle} />
            Add money
          </Button>
          <Button
            gap={{ base: '0.25rem', medium: '0.5rem' }}
            size='small'
            isFullWidth={true}
            onClick={() => onTransact(child, false)}
          >
            <Icon
              ariaLabel='remove icon'
              as={MdRemoveCircle}
              fontWeight='black'
            />
            Deduct money
          </Button>
        </Flex>
      </Flex>
      <AddPhotoDialog
        isOpen={isOpen}
        child={child}
        dataURL={selectedFileDataURL}
        onClose={() => {
          inputRef.current.value = '';
          setIsOpen(false);
        }}
      />
    </Card>
  );
};
