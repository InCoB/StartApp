export const LAYOUT_CONFIG = {
  default: {
    chat: 'w-[60%]',
    artifactList: 'w-[40%]',
  },
  expanded: {
    chat: 'w-[40%]',
    artifactEdit: 'w-[60%]',
  },
  mobile: {
    chat: 'w-full',
    artifactList: 'w-full',
    artifactEdit: 'w-full',
  },
};

export const getLayoutClass = (layout: 'default' | 'expanded' | 'mobile', section: 'chat' | 'artifactList' | 'artifactEdit') => {
  const config = LAYOUT_CONFIG[layout];
  return config[section as keyof typeof config] || 'w-0';
};