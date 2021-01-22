/*const leafNode = (key, value, operator) => ({
    type: "leafNode",
    key: key,
    op: operator,
    value: value
})

const operatorNode = (operator, key="", value=null) => ({
    type: 'operatorNode',
    op: operator,
    key: key,
    value: value
})

const tree = (output, expression) => ({
    output,
    expression
})*/

const nodeEvaluators = {
    ">": (node, table) => {
        if (node.key in table) return  node.value > table[node.key];
        return false;
    },
    "<": (node, table) => {
        if (node.key in table) return table[node.key] < node.value;
        return false;
    }
}

const evaluateLeaf = (node, table) => {
    console.log("leaf", node, table);
    return nodeEvaluators['>'](node, table);
}

const evalOperatorNode = (v, node, table) => {
    if (node.op === 'and') return v && nodeEvaluators['>'](node, table);
    return v || nodeEvaluators['<'](node, table);
}

const evaluate = (expression, table) => {
    let v = evaluateLeaf(expression[0], table);
    for(let i = 1; i < expression.length; i++) {
        v = evalOperatorNode(v, expression[i], table);
    }
    return v;
}

const evaluateTree = (tree, table) => {
    const result = evaluate(tree.expression, table);
    console.log("result----", result);
    if (result) return tree.output;
    return "";
}

export {evaluateTree}

// const exp = operatorNode('and');
// exp.left = operatorNode('or', leafNode('jeans', 71, '>'), leafNode('shirt', 65, '<'));
// exp.right = leafNode('jeans', 70, '<');

// const table = {
//     'pant': 61,
//     'jeans': 69,
//     'shirt': 66
// }

// const t = tree("Jeans Pant", exp);
// console.log(evaluateTree(t, table));



// const operatorEvaluators = {
//     'and': (node, table) => {
//         const leftTreeValue = evaluate(node.left, table);
//         if (!leftTreeValue) return false;
//         return leftTreeValue && evaluate(node.right, table);
//     },
//     'or': (node, table) => {
//         const leftTreeValue = evaluate(node.left, table);
//         if (leftTreeValue) return true;
//         return evaluate(node.right, table);
//     }
// }

// const leafNodeEvaluators = {
//     ">": (node, table) => {
//         if (node.key in table) return table[node.key] > node.value;
//         return false;
//     },
//     "<": (node, table) => {
//         if (node.key in table) return table[node.key] < node.value;
//         return false;
//     }
// }

// const evaluate = (node, table) => {
//     if (node.type === "operatorNode") {
//         if (!(node.op in operatorEvaluators)) throw("Invalid operatorNode type");
//         return operatorEvaluators[node.op](node, table);
//     } else {
//         if (!(node.op in leafNodeEvaluators)) throw("Invalid leaf node type");
//         if (node.left === null || node.right === null) throw('Imbalance expression');
//         return leafNodeEvaluators[node.op](node, table);
//     }
// }

// const evaluateTree = (tree, table) => {
//     const result = evaluate(tree.expression, table);
//     if (result) return tree.output;
//     return "";
// }