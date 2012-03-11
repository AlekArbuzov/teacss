tea.start('assets/tea/comments.tea',1);
/******************\
*                  *
*  Comment Header  *
*                  *
\******************/

/*

    Comment

*/

/*
 * Comment Test
 *
 * - teacss (http://teacss.org)
 *
 */

////////////////
tea.print("@teavar: \"content\"");
////////////////

/* Colors
 * ------
 *   #EDF8FC (background blue)
 *   #166C89 (darkest blue)
 *
 * Text:
 *   #333 (standard text) // A comment within a comment!
 *   #1F9EC9 (standard link)
 *
 */

/* @group Variables
------------------- */
tea.f("#comments /* boo */", function(){
  /**/ // An empty comment
  tea.print("color: red"); /* A C-style comment */
  tea.print("background-color: orange"); // A little comment
  tea.print("font-size: 12px");

  /* lost comment */ tea.print("content: "+(teavar)+"");

  tea.print("border: 1px solid black");

  // padding & margin //
  tea.print("padding: 0"); // }{ '"
  tea.print("margin: 2em");
}); //

/* commented out
  #more-comments {
    color: grey;
  }
*/

tea.f(".selector /* .with */, .lots, /* of */ .comments", function(){
  tea.print("color: grey, /* blue */ orange");
  tea.print("-webkit-border-radius: 2px /* webkit only */");
  tea.print("-moz-border-radius: 2px * 4 /* moz only with operation */");
});

tea.f("#last", function(){ tea.print("color: blue"); });
//

tea.finish();