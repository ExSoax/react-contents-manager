const CMS = require("./cms/index").default;
const {
  CMSContext,
  SubCMSContext,
  withSubCMSContext
} = require("./cms/context");
const Inline = require("./cms/inline").default;

export { CMS, CMSContext, SubCMSContext, withSubCMSContext, Inline };
