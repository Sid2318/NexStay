from typing import TypedDict, Annotated
import os
import sys
import json
from langgraph.graph import add_messages, StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import AIMessage, HumanMessage
from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver

# Load environment variables
load_dotenv()

# Create memory saver for chat history
memory = MemorySaver()

# Initialize the Groq LLM
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    print(json.dumps({"error": "GROQ_API_KEY not found in environment variables"}))
    sys.exit(1)

llm = ChatGroq(api_key=api_key, model="llama-3.1-8b-instant")

# Define chat state
class BasicChatState(TypedDict): 
    messages: Annotated[list, add_messages]

# Define chatbot function
def chatbot(state: BasicChatState): 
    try:
        response = llm.invoke(state["messages"])
        return {
           "messages": [response]
        }
    except Exception as e:
        return {
            "messages": [AIMessage(content=f"Sorry, I encountered an error: {str(e)}")]
        }

# Create state graph
graph = StateGraph(BasicChatState)
graph.add_node("chatbot", chatbot)
graph.add_edge("chatbot", END)
graph.set_entry_point("chatbot")

# Compile the graph
app = graph.compile(checkpointer=memory)

# Setup config for thread persistence
config = {"configurable": {"thread_id": 1}}

# Handle input from stdin
if __name__ == "__main__":
    try:
        # Read user input from stdin
        user_input = sys.stdin.read().strip()
        
        # Process with chatbot
        result = app.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config=config)
        
        # Extract and output AI response
        ai_response = result["messages"][-1].content
        print(json.dumps({"response": ai_response}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
