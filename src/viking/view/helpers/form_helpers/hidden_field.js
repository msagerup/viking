import { hiddenFieldTag } from '../form_tag_helpers';
import { tagNameForModelAttribute } from '../utils';

// hiddenField(model, attribute, options = {})
// =========================================
// 
// Returns a hidden input tag tailored for accessing a specified attribute
// (identified by method) on an object assigned to the template (identified
// by object). Additional options on the input tag can be passed as a hash
// with options. These options will be tagged onto the HTML as an HTML element
// attribute as in the example shown.
//
// Examples
// --------
//   hiddenField(:signup, :pass_confirm)
//   // => <input type="hidden" name="signup[pass_confirm]" value="">
//   
//   hiddenField(:post, :tag_list)
//   // => <input type="hidden" name="post[tag_list]" value="tag1 tag2 tag3">
//   
//   hiddenField(:user, :token)
//   // => <input type="hidden" name="user[token]" value="token">
export const hiddenField = function (model, attribute, options) {
    let value = model.get(attribute);
    let name = tagNameForModelAttribute(model, attribute);
    
    return hiddenFieldTag(name, (value || ''), options);
};

export default hiddenField;