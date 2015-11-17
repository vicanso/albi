
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});




exports.render = function(id){
	ReactDOM.render(
	  <CommentBox />,
	  document.getElementById(id)
	);
}