import { useMemo, useRef, useState, ChangeEvent } from 'react';
import {
  Button,
  Radio,
  Select,
  Space,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Editor } from '@monaco-editor/react';
import { FolderOpenTwoTone, SaveTwoTone } from '@ant-design/icons';
import './App.css';
import initLang from './local';
import useTheme from './use_Theme';

const onChange = (key: string) => {
  console.log(key);
};

const fontData = [
  {
    label: <span style={{ fontFamily: 'monospace' }}>monospace</span>,
    value: 'monospace',
  },
  {
    label: <span style={{ fontFamily: 'fantasy' }}>fantasy</span>,
    value: 'fantasy',
  },
  {
    label: <span style={{ fontFamily: 'sans-serif' }}>sans-serif</span>,
    value: 'sans-serif',
  },
];

function Setting() {
  const { theme, setTheme } = useTheme();
  const handleLightThemeClick = () => {
    setTheme('light');
  };
  const handleDarkThemeClick = () => {
    setTheme('dark');
  };
  const { t } = useTranslation();
  const [fontFamily, setFontFamily] = useState(fontData[0].value);
  const langData = useMemo(
    () => [
      {
        label: <span style={{ fontFamily }}>Русский</span>,
        value: 'ru',
      },
      { label: <span style={{ fontFamily }}>English</span>, value: 'en' },
      {
        label: <span style={{ fontFamily }}>Deutsche</span>,
        value: 'de',
      },
    ],
    [fontFamily]
  );
  return (
    <Space
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme === 'dark' ? '#242f3d' : 'white',
      }}
      direction="vertical"
    >
      <Typography
        style={{ color: theme === 'dark' ? 'white' : 'black', fontFamily }}
      >{`${t('language')}`}</Typography>
      <Select
        style={{
          borderColor: theme === 'dark' ? 'red' : 'blue',
        }}
        defaultValue={langData[0]}
        options={langData}
        onSelect={(value) => i18n.changeLanguage(value)}
      />
      <Typography
        style={{ color: theme === 'dark' ? 'white' : 'black', fontFamily }}
      >
        {t('theme')}
      </Typography>
      {}
      <Radio.Group>
        <Radio.Button
          style={{
            color: theme === 'dark' ? 'white' : 'black',
            backgroundColor: theme === 'dark' ? '#344756' : 'white',
          }}
          onClick={handleLightThemeClick}
        >
          {t('themeLight')}
        </Radio.Button>
        <Radio.Button
          style={{
            color: theme === 'dark' ? 'white' : 'black',
            backgroundColor: theme === 'dark' ? '#344756' : 'white',
          }}
          onClick={handleDarkThemeClick}
        >
          {t('themeDark')}
        </Radio.Button>
      </Radio.Group>
      <Typography
        style={{
          fontFamily,
          color: theme === 'dark' ? 'white' : 'black',
        }}
      >
        {t('font')}
      </Typography>
      <Select
        defaultValue={fontData[0]}
        options={fontData}
        onSelect={(value) => setFontFamily(value)}
      />
    </Space>
  );
}

function onSave(props: { fileName: string; fileValue: string }) {
  const element = document.createElement('a');
  const file = new Blob([props.fileValue], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = `${props.fileName}.json`;
  element.click();
}

function CuteEditor() {
  const options: Editor = {
    minimap: { enabled: false },
  };
  const [textJson, setTextJson] = useState('');
  const uploadRef = useRef<HTMLInputElement>(null);
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/json') {
        console.error('Please upload a .json file');
      }
      console.log(file.type);
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'windows-1251');
      fileReader.onload = () => {
        console.log(fileReader);
        console.log(file.type);
        setTextJson(fileReader.result as string);
      };
    }
  };

  const { theme } = useTheme();
  console.log(theme);
  return (
    <>
      <Button.Group>
        <Button type="text" onClick={() => uploadRef.current?.click()}>
          <FolderOpenTwoTone />
        </Button>
        <input
          type="file"
          ref={uploadRef}
          onChange={handleUpload}
          style={{ display: 'none' }}
        />

        <Button
          type="text"
          onClick={() => onSave({ fileName: 'TextTest', fileValue: textJson })}
        >
          <SaveTwoTone />
        </Button>
      </Button.Group>

      <Editor
        options={options}
        value={textJson}
        onChange={(value) => setTextJson(value)}
        language="JSON"
      />
    </>
  );
}
function Label({ settings }: { settings: boolean }) {
  const { t } = useTranslation();
  return t(settings ? 'settings' : 'editor');
}
export default function App() {
  initLang();
  const { theme } = useTheme();
  console.log(theme);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <Label settings={false} />,
      children: <CuteEditor />,
    },
    {
      key: '2',
      label: <Label settings />,
      children: <Setting />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
      style={{
        // backgroundColor: theme === 'dark' ? 'white' : '#242f3d;',
        top: 0,
        left: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
      hideAdd
      type="card"
    />
  );
}
